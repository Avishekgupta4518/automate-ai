import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteAgent, getAllAgents } from "@/features/agent";
import {
  setAgents,
  setAgentsLoading,
  setDelete,
  setSelectedAgent,
} from "@/redux/agentSlice";
import {
  ArrowLeft,
  Bot,
  Workflow,
  Plus,
  Search,
  RefreshCcw,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const darkPanel =
  "border border-white/10 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

const whiteBtn =
  "rounded-xl border-0 bg-white text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900";

function Agents() {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { agents, agentsLoading: loading } = useSelector(
    (state) => state.agent,
  );

  const filteredAgents = (agents || []).filter((agent) => {
    const query = search.toLowerCase();

    return (
      agent?.name?.toLowerCase()?.includes(query) ||
      agent?.instructions?.toLowerCase()?.includes(query) ||
      agent?.knowledgeBase?.toLowerCase()?.includes(query)
    );
  });

  const fetchAgents = async () => {
    dispatch(setAgentsLoading(true));

    try {
      const data = await getAllAgents();

      dispatch(setAgents(Array.isArray(data) ? data : data?.agents || []));
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setAgentsLoading(false));
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    if (!id || deletingId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agent?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteAgent(id);

      dispatch(setDelete(id));
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUseAgent = (agentId) => {
    dispatch(setSelectedAgent(agentId));
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10 text-white">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900">
              <Workflow size={17} />
            </span>

            <span className="text-sm font-medium tracking-tight">
              Automate AI
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Back to chat</span>
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-300/80">
                <Bot size={15} />
                Agent workspace
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                My Agents
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage your AI agents and choose one to get started.
              </p>
            </div>

            <Button asChild className={`h-10 items-center gap-2 ${whiteBtn}`}>
              <Link to="/agents/new" className="inline-flex items-center gap-2">
                <Plus size={17} className="shrink-0" />
                <span>Create agent</span>
              </Link>
            </Button>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 text-zinc-200"
              />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search agents..."
                className="h-10 rounded-xl border border-white/10 bg-white/4 pl-9 text-white backdrop-blur-xl placeholder:text-zinc-500 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
            </div>

            <p className="text-xs text-zinc-500">
              {agents?.length || 0} Agents
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <RefreshCcw size={22} className="animate-spin text-violet-400" />
              <p className="text-sm text-zinc-500">Loading your agents...</p>
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => {
                const agentId = agent?._id;

                return (
                  <div
                    key={agentId}
                    className={`group flex min-h-56 flex-col rounded-2xl p-5 transition hover:border-white/25 hover:bg-white/6 ${darkPanel}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid size-11 place-items-center rounded-xl bg-white text-zinc-900 shadow-[0_8px_24px_rgba(255,255,255,0.1)]">
                        <Bot size={22} />
                      </div>

                      <button
                        onClick={() => handleDelete(agentId)}
                        type="button"
                        disabled={deletingId === agentId}
                        aria-label="Delete agent"
                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === agentId ? (
                          <RefreshCcw size={16} className="animate-spin" />
                        ) : (
                          <Trash size={16} />
                        )}
                      </button>
                    </div>

                    <h2 className="mt-5 truncate text-base font-medium text-white">
                      {agent?.name || "Untitled Agent"}
                    </h2>

                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-zinc-500">
                      {agent?.instructions || "No instructions provided."}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                      <span className="text-xs text-zinc-600">My Agents</span>

                      <Button
                        type="button"
                        onClick={() => handleUseAgent(agentId)}
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 rounded-lg text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <span>Use agent</span>
                        <ArrowLeft size={16} className="rotate-180 shrink-0" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 text-center">
              <Bot size={28} className="text-zinc-500" />

              <h3 className="mt-4 text-base font-medium text-white">
                No agents found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                {search
                  ? "Try searching with a different keyword."
                  : "Create your first AI agent to get started."}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Agents;
