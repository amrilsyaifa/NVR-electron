import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import ffmpegPath from "ffmpeg-static";
import http from "http";

interface Client extends WebSocket {
  ffmpegProcess?: ChildProcessWithoutNullStreams;
}

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: Client, req) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
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
      console.log(`ffmpeg closed for ${ip}, code ${code}, signal ${signal}`);
    });

    ws.on("close", () => {
      console.log(`Client disconnected from stream ${ip}`);
      if (ws.ffmpegProcess) {
        ws.ffmpegProcess.kill("SIGINT");
      }
    });
  });

  console.log("WebSocket server initialized");
}
