import React, { useState } from "react";
import {
  Search,
  Plus,
  Mail,
  CalendarDays,
  Globe,
  Calculator,
  CheckCircle2,
  Plug,
  ArrowUpRight,
  Workflow,
  X,
} from "lucide-react";

const integrations = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Read, manage, and send emails using your AI agents.",
    category: "Communication",
    icon: Mail,
    color: "text-red-400",
    bg: "bg-red-500/10",
    connected: false,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Manage events, meetings, and your daily schedule.",
    category: "Productivity",
    icon: CalendarDays,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    connected: false,
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for real-time information and news.",
    category: "Research",
    icon: Globe,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    connected: true,
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform mathematical calculations through your AI agents.",
    category: "Utilities",
    icon: Calculator,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    connected: true,
  },
];

const categories = [
  "All",
  "Communication",
  "Productivity",
  "Research",
  "Utilities",
];

const Integration = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [connections, setConnections] = useState(
    integrations.reduce((acc, item) => {
      acc[item.id] = item.connected;
      return acc;
    }, {}),
  );

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(search.toLowerCase()) ||
      integration.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      integration.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const connectedCount = Object.values(connections).filter(Boolean).length;

  const handleConnect = (id) => {
    setConnections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-emerald-400">
              <Workflow size={17} />
              <span>Automate AI / Integrations</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Integrations
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Connect your favorite tools and give your AI agents more
              capabilities.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Plug size={20} />
            </div>

            <div>
              <p className="text-xl font-semibold">
                {connectedCount}/{integrations.length}
              </p>
              <p className="text-xs text-zinc-500">Connected integrations</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-zinc-400">Total integrations</p>
            <h2 className="mt-2 text-3xl font-semibold">
              {integrations.length}
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-zinc-400">Connected</p>
            <h2 className="mt-2 text-3xl font-semibold text-emerald-400">
              {connectedCount}
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-zinc-400">Not connected</p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-300">
              {integrations.length - connectedCount}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search integrations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none transition focus:border-emerald-500/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition ${
                  activeCategory === category
                    ? "bg-emerald-500 text-black"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available integrations</h2>
          <span className="text-xs text-zinc-500">
            {filteredIntegrations.length} results
          </span>
        </div>

        {filteredIntegrations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              const isConnected = connections[integration.id];

              return (
                <div
                  key={integration.id}
                  className="group rounded-xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.045]"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${integration.bg} ${integration.color}`}
                    >
                      <Icon size={24} />
                    </div>

                    {isConnected ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                        <CheckCircle2 size={12} />
                        Connected
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-500">
                        Not connected
                      </span>
                    )}
                  </div>

                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{integration.name}</h3>
                      <span className="text-[10px] text-zinc-500">
                        {integration.category}
                      </span>
                    </div>

                    <p className="min-h-10 text-sm leading-6 text-zinc-400">
                      {integration.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-zinc-500">
                      {isConnected ? "Ready to use" : "Setup required"}
                    </span>

                    <button
                      onClick={() => handleConnect(integration.id)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                        isConnected
                          ? "border border-white/10 text-zinc-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          : "bg-emerald-500 text-black hover:bg-emerald-400"
                      }`}
                    >
                      {isConnected ? "Disconnect" : "Connect"}
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-20 text-center">
            <Search size={30} className="mb-4 text-zinc-600" />
            <h3 className="font-medium">No integrations found</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Try searching with a different name or category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Plus size={22} />
              </div>

              <div>
                <h3 className="font-semibold">Need another integration?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Expand your AI agents with more tools and services.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                window.location.href = "mailto:support@automateai.com"
              }
              className="rounded-lg border border-emerald-500/30 px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10"
            >
              Request integration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;