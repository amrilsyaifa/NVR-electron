import http from "http";
import app from "./server";
import { setupWebSocket } from "./wsServer";

const port = 8000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});

setupWebSocket(server);
