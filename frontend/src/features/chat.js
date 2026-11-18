import api from "@/api";

export const chat = async (message) => {
  try {
    const { data } = await api.post("/api/chat", {
      message,
    });
    return data;
  } catch (error) {
    console.log("Chat Error:", error.response?.data || error.message);
    throw error;
  }
};

export const agentChat = async (message, agent) => {
  try {
    console.log("Agent Chat Request:", { message, agent });

    const { data } = await api.post("/api/chat/agent", {
      message,
      agent,
    });

    return data;
  } catch (error) {
    console.log("Backend Error:", error.response?.data);
    console.log("Backend Status:", error.response?.status);
    console.log("Backend Response:", error.response?.data);
    console.log("Error Message:", error.message);
    throw error;
  }
};
