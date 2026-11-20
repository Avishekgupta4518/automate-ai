import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import agentRouter from "./routes/agent.route.js";
import chatRouter from "./routes/chat.route.js";
import integrationRouter from "./routes/integration.route.js";
const app = express();

const port = process.env.port || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/agent", agentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/integrations", integrationRouter);
app.listen(port, () => {
  connectDb();
  console.log(`server is running at ${port}`);
});
