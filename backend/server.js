"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const cctvRoutes_1 = __importDefault(require("./src/routes/cctvRoutes"));
const discoverCctvRoutes_1 = __importDefault(require("./src/routes/discoverCctvRoutes"));
const app = (0, express_1.default)();
const port = 8000;
const httpServer = app.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
});
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    console.log("New client connected:", params);
    const ip = params.get("ip");
    const username = params.get("username");
    const password = params.get("password");
    const rtspPort = "8554";
    const rtspPath = "/Streaming/Channels/101";
    if (!ip) {
        ws.close();
        console.error("No IP provided for stream");
        return;
    }
    const rtspUrl = `rtsp://${username}:${password}@${ip}:${rtspPort}${rtspPath}`;
    if (!ffmpeg_static_1.default) {
        throw new Error("ffmpeg executable not found");
    }
    const ffmpeg = (0, child_process_1.spawn)(ffmpeg_static_1.default, [
        "-rtsp_transport",
        "tcp",
        "-i",
        rtspUrl,
        "-f",
        "mpegts",
        "-codec:v",
        "copy",
        "-codec:a",
        "mp2",
        "-",
    ]);
    ws.ffmpegProcess = ffmpeg;
    ffmpeg.stdout?.on("data", (chunk) => {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(chunk);
        }
    });
    ffmpeg.stderr.on("data", (data) => {
        console.error("ffmpeg error:", data.toString());
    });
    ffmpeg.on("close", (code, signal) => {
        console.log(`ffmpeg process closed for ${ip}, code ${code}, signal ${signal}`);
    });
    ws.on("close", () => {
        console.log(`Client disconnected from stream ${ip}`);
        if (ws.ffmpegProcess) {
            ws.ffmpegProcess.kill("SIGINT");
        }
    });
});
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
app.use("/api", authRoutes_1.default);
app.use("/api", cctvRoutes_1.default);
app.use("/api", discoverCctvRoutes_1.default);
