import http from "http";
import app from "./src/servers/server";
import { setupWebSocket } from "./src/servers/wsServer";

const port = 8000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`HTTP server running at http://localhost:${port}`);
});

setupWebSocket(server);
