import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import ffmpegPath from "ffmpeg-static";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes";
import cctvRoutes from "./src/routes/cctvRoutes";
import discoverCctvRoutes from "./src/routes/discoverCctvRoutes";

const app = express();
const port = 8000;

const httpServer = app.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server: httpServer });

interface Client extends WebSocket {
  ffmpegProcess?: ChildProcessWithoutNullStreams;
}

wss.on("connection", (ws: Client, req) => {
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

  if (!ffmpegPath) {
    throw new Error("ffmpeg executable not found");
  }

  const ffmpeg = spawn(ffmpegPath, [
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

  ffmpeg.stdout?.on("data", (chunk: Buffer) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(chunk);
    }
  });

  ffmpeg.stderr.on("data", (data: Buffer) => {
    console.error("ffmpeg error:", data.toString());
  });

  ffmpeg.on("close", (code, signal) => {
    console.log(
      `ffmpeg process closed for ${ip}, code ${code}, signal ${signal}`
    );
  });

  ws.on("close", () => {
    console.log(`Client disconnected from stream ${ip}`);
    if (ws.ffmpegProcess) {
      ws.ffmpegProcess.kill("SIGINT");
    }
  });
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/api", authRoutes);
app.use("/api", cctvRoutes);
app.use("/api", discoverCctvRoutes);
