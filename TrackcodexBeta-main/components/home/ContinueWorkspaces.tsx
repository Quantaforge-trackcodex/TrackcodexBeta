import React from "react";
import { useNavigate } from "react-router-dom";

const ContinueWorkspaces = () => {
  const navigate = useNavigate();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [workspaces, setWorkspaces] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real app we might want to Promise.all with some status checks or similar
    // For now just list them
    import("../../services/api").then(({ api }) => {
      api.workspaces
        .list()
        .then((data) => {
          // Map backend data to UI format if needed, or use as is if compatible
          // Backend returns: { id, name, description, status, ownerId, ... }
          // UI expects: { name, org, status, badgeColor, aiText, icon, aiColor } relative to mocks
          // We will adapt the display to be more generic for real data
          setWorkspaces(data);
        })
        .catch((err) => console.error("Failed to load workspaces", err))
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gh-text-secondary animate-pulse">
        Loading active sessions...
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-8 text-center border-dashed">
        <h3 className="text-gh-text font-bold mb-2">No Active Sessions</h3>
        <p className="text-gh-text-secondary text-sm mb-6">
          You haven't started any workspaces yet.
        </p>
        <button
          onClick={() => navigate("/workspace/new")}
          className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Launch New Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((ws, i) => (
        <div
          key={ws.id || i}
          className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 shadow-lg hover:border-primary/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all group relative overflow-hidden hover-lift"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gh-text truncate group-hover:text-primary transition-colors">
                {ws.name}
              </h3>
              <p className="text-[11px] text-gh-text-secondary mt-0.5 font-bold uppercase tracking-wider">
                {ws.owner?.name || "Personal"}
              </p>
            </div>
            <div
              className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase flex items-center gap-1 shrink-0 
                ${ws.status === "Running" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-gh-text-secondary bg-gh-text-secondary/10 border-gh-text-secondary/20"}`}
            >
              <span className="material-symbols-outlined !text-[12px] filled">
                {ws.status === "Running" ? "bolt" : "stop_circle"}
              </span>
              {ws.status}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <span className="material-symbols-outlined !text-[16px] text-primary">
              auto_awesome
            </span>
            <span className="text-[12px] font-bold text-gh-text-secondary">
              {ws.description
                ? ws.description.length > 30
                  ? ws.description.substring(0, 30) + "..."
                  : ws.description
                : "Ready to resume"}
            </span>
          </div>
          <button
            onClick={() => navigate(`/workspace/${ws.id}`)}
            className="w-full py-2.5 bg-gh-bg border border-gh-border rounded-xl text-sm font-bold text-gh-text hover:bg-primary transition-all shadow-sm relative z-10 cursor-pointer"
          >
            Resume Session
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContinueWorkspaces;
