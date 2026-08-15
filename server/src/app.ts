import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import boardRoutes from "./routes/boards";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);