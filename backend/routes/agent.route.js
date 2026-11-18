import express from "express";
import {
  createAgent,
  getAgentById,
  deleteAgent,
  getAllAgent,
} from "../controllers/agent.controller.js";
import protect from "../middleware/protect.js";

const agentRouter = express.Router();

agentRouter.post("/", protect, createAgent);
agentRouter.get("/all", protect, getAllAgent);
agentRouter.get("/:id", protect, getAgentById);
agentRouter.delete("/:id", protect, deleteAgent);

export default agentRouter;