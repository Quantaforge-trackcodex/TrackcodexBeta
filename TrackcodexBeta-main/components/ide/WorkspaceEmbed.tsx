import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../context/AuthContext";

const WorkspaceEmbed: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ideUrl, setIdeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const startWorkspace = async () => {
      try {
        // Use central API instance --> handles Base URL + Credentials + CSRF automatically
        const response = await api.post(`/workspaces/${id}/start`);
        setIdeUrl(response.data.url);
      } catch (err: any) {
        console.error("Workspace start error:", err);
        const msg =
          err.response?.data?.message || err.message || "Failed to connect";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    startWorkspace();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-white space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#007fd4]/20 blur-xl rounded-full"></div>
          {/* TrackCodex Logo SVG */}
          <svg
            className="w-16 h-16 relative z-10 animate-pulse"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M256 64L448 256L320 384L128 192L256 64Z" fill="#3b82f6" />
            <path d="M256 448L64 256L192 128L384 320L256 448Z" fill="#1d4ed8" />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight font-display text-slate-200">
            TrackCodex Workspace
          </h2>
          <div className="w-48 h-1 bg-[#333] rounded-full overflow-hidden">
            <div className="h-full bg-[#007fd4] animate-[loading_1.5s_ease-in-out_infinite] w-full origin-left"></div>
          </div>
          <p className="text-[10px] text-[#969696] font-mono mt-1 animate-pulse">
            INITIALIZING_CONTAINER...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-[#f48771]">
        <span className="material-symbols-outlined !text-[48px] mb-4">
          error
        </span>
        <h2 className="text-lg font-bold">Workspace Error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded text-sm transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#1e1e1e] overflow-hidden">
      {ideUrl && (
        <iframe
          src={ideUrl}
          className="w-full h-full border-none"
          title="TrackCodex IDE"
          allow="clipboard-read; clipboard-write; camera; microphone; display-capture"
        />
      )}
    </div>
  );
};

export default WorkspaceEmbed;
