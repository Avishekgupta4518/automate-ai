import Agent from "../models/agent.model.js";
import { createAgentGraph } from "../utils/agentGraph.js";
import { HumanMessage } from "@langchain/core/messages";
import mongoose from "mongoose";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const threadId = String(req.user._id);

    if (!threadId || !message) {
      return res.status(400).json({
        message: "Message and ThreadId required",
      });
    }

    const graph = await createAgentGraph(
      { instructions: "You are AutoMate AI, a helpful personal assistant." },
      threadId,
    );

    const data = await graph.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      },
    );

    const lastMessage = data.messages[data.messages.length - 1].content;

    return res.status(200).json({
      success: true,
      aiResponse: lastMessage,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Chat request failed",
    });
  }
};

export const agentChat = async (req, res) => {
  try {
    const { message, agent } = req.body;

    if (!message?.trim() || !agent) {
      return res.status(400).json({
        message: "Message and Agent ID required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(agent)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID",
      });
    }

    const existingAgent = await Agent.findOne({
      _id: agent,
      userId: req.user._id,
    });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }
    const threadId = `${req.user._id.toString()}:${existingAgent?._id}`
    const graph = await createAgentGraph(existingAgent, req.user._id);
    const result = await graph.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        configurable: {
          thread_id: threadId,
        },
      },
    );

    const lastMessage = result.messages[result.messages.length - 1];

    return res.status(200).json({
      success: true,
      aiResponse: lastMessage.content,
    });
  } catch (error) {
    console.error("Agent Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Agent chat controller error",
    });
  }
};
