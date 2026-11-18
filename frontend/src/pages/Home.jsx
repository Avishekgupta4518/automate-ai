import React, { useState } from "react";
import {
  Bot,
  LogOut,
  Plus,
  Settings2,
  Workflow,
  UserRound,
  ImagePlus,
  ChevronDown,
  Check,
  ArrowUpIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth";
import { agentChat, chat } from "@/features/chat";
import { setUserData } from "@/redux/userSlice";
import { setSelectedAgent } from "@/redux/agentSlice";

const hideScrollbar =
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const darkPanel =
  "border border-white/10 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl";

const menuContent =
  "rounded-2xl border border-white/10 bg-[#1d2026]/95 p-1.5 text-zinc-100 shadow-2xl shadow-black/50 backdrop-blur-xl";

const menuItem = "rounded-xl text-zinc-300 focus:bg-white/10 focus:text-white";

const menuSeparator = "bg-white/10";

const iconBtn =
  "size-9 rounded-xl border border-white/10 bg-white/5 p-0 text-zinc-300 hover:bg-white/10 hover:text-white";

const whiteBtn =
  "rounded-xl border-0 bg-white text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900";

function Home() {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const { agents = [], selectedAgent } = useSelector((state) => state.agent);

  const dispatch = useDispatch();

  // Support both previously saved agent names and the recommended ID-based selection.
  const selectedAgentId =
    typeof selectedAgent === "object" ? selectedAgent?._id : selectedAgent;

  const currentAgent = agents.find(
    (agent) =>
      String(agent?._id) === String(selectedAgentId) ||
      agent?.name === selectedAgent,
  );

  const handleSelectAgent = (agent) => {
    if (!agent?._id) return;

    dispatch(setSelectedAgent(String(agent._id)));
    setMessages([]);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      dispatch(setUserData(null));
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    try {
      let res;

      if (currentAgent?._id) {
        res = await agentChat(userMessage, currentAgent._id);
      } else {
        res = await chat(userMessage);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res?.aiResponse ||
            res?.message ||
            "Something went wrong. Please try again.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#2b2f3a_0%,#191b21_55%,#121317_100%)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="z-30 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900">
              <Workflow size={17} />
            </span>

            <span className="text-sm font-medium tracking-tight">
              Automate AI
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={iconBtn}>
                  <Workflow size={17} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className={`w-56 ${menuContent}`}
              >
                <DropdownMenuItem asChild className={menuItem}>
                  <Link
                    to="/agents"
                    className="flex items-center gap-2.5 py-2.5"
                  >
                    <Bot size={17} />
                    My Agents
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem asChild className={menuItem}>
                  <Link
                    to="/agents/new"
                    className="flex items-center gap-2.5 py-2.5"
                  >
                    <Plus size={17} />
                    Create New Agent
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem asChild className={menuItem}>
                  <Link
                    to="/integration"
                    className="flex items-center gap-2.5 py-2.5"
                  >
                    <Settings2 size={17} />
                    Integration
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  className="flex size-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  {userData?.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={17} className="text-zinc-300" />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className={`w-64 ${menuContent}`}
              >
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {userData?.name || "User"}
                    </p>

                    <p className="truncate text-xs text-zinc-500">
                      {userData?.email || "email"}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem asChild className={menuItem}>
                  <Link
                    to="/agents/new"
                    className="flex items-center gap-2.5 py-2.5"
                  >
                    <Plus size={17} />
                    Create New Agent
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className={menuSeparator} />

                <DropdownMenuItem
                  onSelect={handleLogout}
                  disabled={logoutLoading}
                  className="cursor-pointer gap-2.5 rounded-xl py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                >
                  <LogOut size={16} />
                  {logoutLoading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">
          <section className="flex min-h-0 flex-1 flex-col">
            <div className={`min-h-0 flex-1 overflow-y-auto ${hideScrollbar}`}>
              <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
                {messages.length === 0 && (
                  <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
                    <div className="mb-7 grid size-14 place-items-center rounded-2xl bg-white text-zinc-900">
                      <Workflow size={26} />
                    </div>

                    <p className="text-base font-medium text-violet-300/80">
                      Hi, {userData?.name || "User"}
                    </p>

                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Can I help you with anything?
                    </h1>

                    <p className="mt-4 max-w-sm text-xs leading-5 text-zinc-500">
                      {currentAgent
                        ? `You are chatting with ${currentAgent.name}.`
                        : "Ask questions, automate tasks, or upload an image to prepare an Instagram post."}
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mr-3 mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-white text-zinc-900">
                        <Workflow size={15} />
                      </div>
                    )}

                    <div
                      className={`max-w-[90%] wrap-break-word px-4 py-3 text-sm leading-7 sm:max-w-[80%] ${
                        message.role === "user"
                          ? `rounded-2xl rounded-br-md text-white ${darkPanel}`
                          : "text-zinc-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <div className="grid size-8 place-items-center rounded-lg bg-white text-zinc-900">
                      <Workflow size={15} />
                    </div>
                    Thinking...
                  </div>
                )}
              </div>
            </div>

            <div className="z-20 w-full shrink-0 px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
              <form
                onSubmit={handleSubmit}
                className={`mx-auto w-full max-w-2xl rounded-2xl border p-3 transition-colors focus-within:border-white/25 ${darkPanel}`}
              >
                <Textarea
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  value={message}
                  placeholder="Ask me anything..."
                  className={`min-h-20 resize-none border-0 bg-transparent! px-2 py-1.5 text-sm text-white shadow-none placeholder:text-zinc-500 focus-visible:ring-0 ${hideScrollbar}`}
                />

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label="Attach image"
                      title="Attach image"
                      className="size-8 rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <ImagePlus size={17} />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 max-w-48 gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <Bot size={16} />

                          <span className="truncate">
                            {currentAgent?.name || "No Agent"}
                          </span>

                          <ChevronDown size={14} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="start"
                        side="top"
                        className={`mb-2 w-60 ${menuContent}`}
                      >
                        {agents.length === 0 && (
                          <DropdownMenuItem disabled className={menuItem}>
                            No Agent Found
                          </DropdownMenuItem>
                        )}

                        {agents.map((agent) => {
                          const isSelected =
                            String(selectedAgentId) === String(agent._id);

                          return (
                            <DropdownMenuItem
                              key={agent._id}
                              onClick={() => handleSelectAgent(agent)}
                              className={`cursor-pointer gap-2 ${menuItem}`}
                            >
                              <Bot
                                size={15}
                                className="shrink-0 text-violet-300"
                              />

                              <span className="truncate">{agent.name}</span>

                              {isSelected && (
                                <Check
                                  size={15}
                                  className="ml-auto shrink-0 text-emerald-400"
                                />
                              )}
                            </DropdownMenuItem>
                          );
                        })}

                        <DropdownMenuSeparator className={menuSeparator} />

                        <DropdownMenuItem asChild className={menuItem}>
                          <Link
                            to="/agents/new"
                            className="flex items-center gap-2"
                          >
                            <Plus size={15} />
                            Create New Agent
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      size="icon"
                      aria-label="Send message"
                      disabled={!message.trim() || loading}
                      className={`size-8 shrink-0 ${whiteBtn} disabled:bg-white/10 disabled:text-zinc-500`}
                    >
                      <ArrowUpIcon size={16} />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;
