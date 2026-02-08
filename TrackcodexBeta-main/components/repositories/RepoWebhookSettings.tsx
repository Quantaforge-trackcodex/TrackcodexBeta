import React, { useEffect, useState } from "react";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  deliveries: unknown[];
}

const RepoWebhookSettings = ({ repoId }: { repoId: string }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newHook, setNewHook] = useState({
    url: "",
    secret: "",
    events: ["push"],
  });

  const fetchWebhooks = React.useCallback(async () => {
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      const response = await fetch(
        `${apiBase}/repositories/${repoId}/webhooks`,
      );
      const data = await response.json();
      setWebhooks(data);
    } catch {
      console.error("Failed to fetch webhooks");
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const handleAdd = async () => {
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      await fetch(`${apiBase}/repositories/${repoId}/webhooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHook),
      });
      setShowAdd(false);
      fetchWebhooks();
    } catch {
      console.error("Failed to add webhook");
    }
  };

  const handlePing = async (id: string) => {
    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || "/api/v1";
      await fetch(`${apiBase}/webhooks/${id}/ping`, { method: "POST" });
      alert("Ping dispatched!");
      fetchWebhooks();
    } catch {
      console.error("Failed to ping webhook");
    }
  };

  if (loading)
    return (
      <div className="p-4 text-gh-text-secondary">Loading webhooks...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gh-text">Webhooks</h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
        >
          {showAdd ? "Cancel" : "Add Webhook"}
        </button>
      </div>

      {showAdd && (
        <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-[2rem] space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gh-text-secondary uppercase">
              Payload URL
            </label>
            <input
              value={newHook.url}
              onChange={(e) => setNewHook({ ...newHook, url: e.target.value })}
              className="w-full bg-gh-bg border border-gh-border rounded-xl px-4 py-2 text-sm text-gh-text focus:ring-2 focus:ring-primary/40 outline-none"
              placeholder="https://example.com/webhook"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gh-text-secondary uppercase">
              Secret
            </label>
            <input
              type="password"
              value={newHook.secret}
              onChange={(e) =>
                setNewHook({ ...newHook, secret: e.target.value })
              }
              className="w-full bg-gh-bg border border-gh-border rounded-xl px-4 py-2 text-sm text-gh-text focus:ring-2 focus:ring-primary/40 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20"
          >
            Create Webhook
          </button>
        </div>
      )}

      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <div className="p-12 text-center bg-[#161b22] border border-[#30363d] rounded-[2.5rem] text-gh-text-secondary italic">
            No webhooks configured for this repository.
          </div>
        ) : (
          webhooks.map((hook) => (
            <div
              key={hook.id}
              className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl flex items-center justify-between group hover:border-gh-border/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#3fb950]">
                  link
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gh-text">
                    {hook.url}
                  </span>
                  <span className="text-[10px] text-gh-text-secondary uppercase tracking-tight">
                    Events: {hook.events.join(", ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePing(hook.id)}
                  className="text-xs font-bold text-[#58a6ff] hover:underline"
                >
                  Ping
                </button>
                <div
                  className={`size-2 rounded-full ${hook.active ? "bg-[#3fb950]" : "bg-[#8b949e]"}`}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RepoWebhookSettings;
