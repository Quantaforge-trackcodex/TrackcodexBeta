import React, { useState, useEffect } from "react";

interface Environment {
  id: string;
  name: string;
  reviewers: Array<{
    id: string;
    user?: { username: string; avatar?: string };
    team?: { name: string };
  }>;
}

const EnvironmentSettings: React.FC<{ repoId: string }> = ({ repoId }) => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchEnvironments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/environments`);
      const data = await res.json();
      setEnvironments(data);
    } catch (err) {
      console.error("Failed to fetch environments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironments();
  }, [repoId]);

  const handleCreate = async () => {
    if (!newName) return;
    // In a real app, this would be a POST /api/v1/repositories/:repoId/environments
    alert(
      "This is a demo. In a live environment, this would create the environment in the database.",
    );
    setIsCreating(false);
    setNewName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Environments</h2>
          <p className="text-sm text-[#8b949e]">
            Configure deployment protection rules and secrets for specific
            environments.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          New Environment
        </button>
      </div>

      {isCreating && (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 animate-in zoom-in-95 duration-300">
          <h3 className="text-sm font-bold text-white mb-4">
            Create new environment
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#8b949e] uppercase mb-2 block">
                Environment Name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. production"
                className="w-full bg-gh-bg border border-gh-border rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm text-[#8b949e] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : environments.length > 0 ? (
          environments.map((env) => (
            <div
              key={env.id}
              className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 hover:border-gh-text-secondary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gh-text-secondary">
                    cloud
                  </span>
                  <h3 className="text-lg font-bold text-white">{env.name}</h3>
                </div>
                <button className="text-[#8b949e] hover:text-white transition-all">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400">
                      security
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Required Reviewers
                      </p>
                      <p className="text-xs text-[#8b949e]">
                        {env.reviewers.length} reviewer(s) configured
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">
                    Manage
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-400">
                      timer
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">Wait Timer</p>
                      <p className="text-xs text-[#8b949e]">
                        No wait timer configured
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center border-2 border-dashed border-gh-border rounded-2xl bg-gh-bg-secondary/20">
            <span className="material-symbols-outlined !text-[48px] text-[#8b949e] mb-4 opacity-50">
              cloud_off
            </span>
            <h3 className="text-lg font-bold text-white mb-1">
              No environments configured
            </h3>
            <p className="text-sm text-[#8b949e] max-w-xs mx-auto">
              Environments allow you to control where your code is deployed and
              who can approve it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentSettings;
