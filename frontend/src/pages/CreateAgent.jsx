import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Workflow, ArrowLeft, Bot, Check } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAgent } from "@/features/agent";

const availableTools = [
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform mathematical calculations",
  },
  {
    id: "web.search",
    name: "Web Search",
    description: "Search for information on the web",
  },
  {
    id: "gmail.read",
    name: "Read Emails",
    description: "Read and summarize emails",
  },
  {
    id: "gmail.send",
    name: "Send Emails",
    description: "Draft and send emails",
  },
];

const darkPanel =
  "border border-white/10 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

const fieldCls =
  "rounded-xl border border-white/10 bg-white/4 text-sm text-white backdrop-blur-xl placeholder:text-zinc-500 focus-visible:border-white/25 focus-visible:ring-0";

const CreateAgent = () => {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [tools, setTools] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleTool = (tool) => {
    setTools((prevTools) =>
      prevTools.includes(tool)
        ? prevTools.filter((t) => t !== tool)
        : [...prevTools, tool],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !instructions.trim() || !knowledgeBase.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createAgent({
        name: name.trim(),
        knowledgeBase,
        instructions,
        tools,
      });

      console.log(result);

      if (result?.response?.data?.message) {
        setError(result.response.data.message);
        return;
      }

      navigate("/agents");
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create agent. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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

        <main className="mx-auto w-full max-w-2xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
          <div className="mb-9">
            <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-white text-zinc-900 shadow-[0_10px_40px_rgba(255,255,255,0.12)]">
              <Bot size={24} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Create an agent
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Configure your AI agent and define what it can do.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`space-y-7 rounded-3xl p-5 sm:p-7 ${darkPanel}`}
          >
            <section className="space-y-5">
              <div>
                <label
                  htmlFor="agent-name"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Agent Name
                </label>

                <Input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  id="agent-name"
                  placeholder="e.g. Research Assistant"
                  maxLength={100}
                  required
                  className={`h-11 ${fieldCls}`}
                />
              </div>

              <div>
                <label
                  htmlFor="instructions"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Instruction
                </label>

                <Input
                  onChange={(e) => setInstructions(e.target.value)}
                  value={instructions}
                  id="instructions"
                  placeholder="Instructions"
                  maxLength={100}
                  required
                  className={`h-11 ${fieldCls}`}
                />
              </div>

              <div>
                <label
                  htmlFor="knowledgeBase"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Knowledge Base
                </label>

                <Textarea
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  value={knowledgeBase}
                  id="knowledgeBase"
                  placeholder="You are a helpful AI Assistant. Your job is to..."
                  required
                  className={`min-h-40 resize-y leading-6 ${fieldCls}`}
                />
              </div>
            </section>

            <section>
              <div className="mb-3">
                <h2 className="text-xs font-medium text-zinc-300">Tools</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Select the capabilities available to your agent.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                {availableTools.map((t, index) => {
                  const selected = tools.includes(t.id);

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTool(t.id)}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition ${
                        index !== 0 ? "border-t border-white/8" : ""
                      } ${
                        selected ? "bg-white/9" : "bg-white/2 hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {t.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {t.description}
                        </p>
                      </div>

                      <div
                        className={`grid size-5 shrink-0 place-items-center rounded-md border transition ${
                          selected
                            ? "border-white bg-white text-zinc-900"
                            : "border-white/20 bg-transparent"
                        }`}
                      >
                        {selected && <Check size={13} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-300"
              >
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-5">
              <Button
                onClick={() => navigate("/")}
                type="button"
                variant="ghost"
                className="rounded-xl border border-white/8 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="h-10 rounded-xl bg-white px-5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Agent"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateAgent;
