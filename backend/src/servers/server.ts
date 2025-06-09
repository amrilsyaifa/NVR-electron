import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "../routes/authRoutes";
import cctvRoutes from "../routes/cctvRoutes";
import discoverCctvRoutes from "../routes/discoverCctvRoutes";

const app = express();

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

export default app;
