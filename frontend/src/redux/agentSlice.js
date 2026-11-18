import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  agents: [],
  selectedAgent: null,
  agentsLoading: false,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setAgents: (state, action) => {
      state.agents = action.payload;
    },

    setSelectedAgent: (state, action) => {
      state.selectedAgent = action.payload;
    },

    setAgentsLoading: (state, action) => {
      state.agentsLoading = action.payload;
    },

    setDelete: (state, action) => {
      state.agents = state.agents.filter(
        (agent) => agent?._id !== action.payload
      );

      if (state.selectedAgent === action.payload) {
        state.selectedAgent = null;
      }
    },
  },
});

export const {
  setAgents,
  setSelectedAgent,
  setAgentsLoading,
  setDelete,
} = agentSlice.actions;

export default agentSlice.reducer;