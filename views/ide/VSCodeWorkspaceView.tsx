import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VSCodeWebBridge from "../../components/ide/VSCodeWebBridge";
import { useTheme } from "../../context/ThemeContext";

/**
 * VSCodeWorkspaceView — Full VS Code Web Integration
 *
 * Replaces the Monaco-based IDEShim with real VS Code OSS running
 * inside an iframe. When opening a workspace:
 *
 *  1. Calls backend to start the workspace (gets VS Code Web URL)
 *  2. Embeds VS Code Web via VSCodeWebBridge component
 *  3. Workspace files are mounted automatically
 *
 * Falls back to localhost:8080 if the workspace start API isn't available.
 */
const VSCodeWorkspaceView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [vsCodeUrl, setVsCodeUrl] = useState<string | null>(null);
    const [workspaceName, setWorkspaceName] = useState("Workspace");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const { resolvedTheme } = useTheme();

    // ── Sync Theme with VS Code Settings ───────────────────────
    useEffect(() => {
        const syncTheme = async () => {
            try {
                await fetch("/api/v1/ide/theme", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ theme: resolvedTheme.type })
                });
            } catch (err) {
                console.warn("Failed to sync theme with IDE:", err);
            }
        };

        syncTheme();
    }, [resolvedTheme.type]);

    // ── Start workspace & get VS Code URL ──────────────────────
    const startWorkspace = useCallback(async () => {
        if (!id) return;

        setStatus("loading");

        try {
            // Fetch workspace details
            const detailRes = await fetch(`/api/v1/workspaces/${id}`);
            if (detailRes.ok) {
                const detail = await detailRes.json();
                setWorkspaceName(detail.name || "Workspace");
            }

            // Start workspace — this spins up VS Code Web server
            const startRes = await fetch(`/api/v1/workspaces/${id}/start`, {
                method: "POST",
            });

            if (startRes.ok) {
                const data = await startRes.json();
                // Backend returns { url: 'http://localhost:XXXX', port: XXXX }
                setVsCodeUrl(data.url || "http://localhost:8080");
            } else {
                // If start API doesn't work, fallback to default VS Code Web URL
                console.warn("Workspace start API returned error, using default VS Code Web URL");
                setVsCodeUrl("http://localhost:8080");
            }

            setStatus("ready");
        } catch (err) {
            console.error("Failed to start workspace:", err);
            // Fallback — try to connect to the default VS Code Web
            setVsCodeUrl("http://localhost:8080");
            setStatus("ready");
        }
    }, [id]);

    useEffect(() => {
        startWorkspace();
    }, [startWorkspace]);

    const handleVSCodeReady = () => {
        console.log(`✅ VS Code Web ready for workspace ${id}`);
    };

    const handleVSCodeError = (error: Error) => {
        console.error("VS Code Web error:", error.message);
        setErrorMsg(error.message);
        setStatus("error");
    };

    // ── Loading state ──────────────────────────────────────────
    if (status === "loading") {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[#1e1e1e]">
                <div className="text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                    <h2 className="text-white text-lg font-semibold mb-2">
                        Starting {workspaceName}
                    </h2>
                    <p className="text-[#858585] text-sm">
                        Preparing VS Code environment...
                    </p>
                </div>
            </div>
        );
    }

    // ── Error state ────────────────────────────────────────────
    if (status === "error") {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[#1e1e1e]">
                <div className="text-center max-w-md px-6">
                    <span className="material-symbols-outlined text-[#f48771] text-[64px] block mb-4">
                        error
                    </span>
                    <h3 className="text-white text-lg font-semibold mb-2">
                        Failed to Start IDE
                    </h3>
                    <p className="text-[#cccccc] text-sm mb-4">{errorMsg}</p>

                    <div className="text-left bg-[#2d2d2d] border border-[#3c3c3c] rounded-md p-4 text-xs mb-4">
                        <p className="text-[#858585] mb-2">To fix this:</p>
                        <ol className="list-decimal list-inside text-[#cccccc] space-y-1">
                            <li>
                                Build VS Code Web:{" "}
                                <code className="bg-[#1e1e1e] px-1">npm run build:vscode</code>
                            </li>
                            <li>
                                Start VS Code server:{" "}
                                <code className="bg-[#1e1e1e] px-1">npm run serve:vscode</code>
                            </li>
                            <li>
                                Verify at{" "}
                                <code className="bg-[#1e1e1e] px-1">http://localhost:8080</code>
                            </li>
                        </ol>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            title="Retry starting workspace"
                            onClick={startWorkspace}
                            className="px-4 py-2 bg-[#8b5cf6] text-white rounded-md text-sm hover:bg-[#7c3aed] transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            title="Go back to workspaces"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-[#3c3c3c] text-[#cccccc] rounded-md text-sm hover:bg-[#4c4c4c] transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── VS Code Web iframe ─────────────────────────────────────
    return (
        <div className="w-full h-screen relative">
            <VSCodeWebBridge
                workspaceId={id}
                workspacePath={`/workspaces/${id}`}
                src={vsCodeUrl || undefined}
                onReady={handleVSCodeReady}
                onError={handleVSCodeError}
            />

            {/* Floating workspace badge */}
            <div className="absolute top-3 right-3 bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#3c3c3c] rounded-lg px-3 py-1.5 flex items-center gap-2 z-20 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-[#858585]">{workspaceName}</span>
            </div>
        </div>
    );
};

export default VSCodeWorkspaceView;
