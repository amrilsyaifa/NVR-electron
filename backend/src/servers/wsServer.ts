import { WebSocketServer, WebSocket } from "ws";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import ffmpegPath from "ffmpeg-static";
import http from "http";
import fs from "fs";
import path from "path";

interface Client extends WebSocket {
  ffmpegProcess?: ChildProcessWithoutNullStreams;
}

// Global rekaman process (1 proses untuk rekaman RTSP ke file)
let recordingProcess: ChildProcessWithoutNullStreams | null = null;

function startRecording(rtspUrl: string) {
  if (recordingProcess) {
    console.log("Recording already running");
    return;
  }

  const recordingsDir = path.join(process.cwd(), "recordings");
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  const outputPath = path.join(recordingsDir, `recording-${Date.now()}.ts`);

  recordingProcess = spawn(ffmpegPath!, [
    "-rtsp_transport",
    "tcp",
    "-i",
    rtspUrl,
    "-c",
    "copy",
    "-f",
    "mpegts",
    outputPath,
  ]);

  recordingProcess.stderr.on("data", (data) => {
    console.log("[Recording ffmpeg]", data.toString());
  });

  recordingProcess.on("close", (code, signal) => {
    console.log(`Recording stopped, code ${code}, signal ${signal}`);
    recordingProcess = null;
  });

  console.log(`Recording started: ${outputPath}`);
}

function stopRecording() {
  if (recordingProcess) {
    recordingProcess.kill("SIGINT");
    recordingProcess = null;
    console.log("Recording stopped");
  }
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

    // Mulai rekaman jika belum jalan (bisa kamu sesuaikan agar start/stop rekaman dikontrol manual)
    if (!recordingProcess) {
      startRecording(rtspUrl);
    }

    const ffmpeg = spawn(ffmpegPath, [
      "-rtsp_transport",
      "tcp",
      "-fflags",
      "nobuffer",
      "-flags",
      "low_delay",
      "-i",
      rtspUrl,
      "-f",
      "mpegts",
      "-codec:v",
      "copy",
      "-an",
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
