import React, { useEffect, useRef, useState } from "react";

interface VSCodeWebBridgeProps {
  workspaceId?: string;
  workspacePath?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

/**
 * VSCodeWebBridge - Embeds VS Code Web into TrackCodex
 *
 * This component:
 * - Renders VS Code Web in an iframe
 * - Bridges authentication between TrackCodex and VS Code
 * - Handles workspace mounting and switching
 * - Manages postMessage communication
 */
const VSCodeWebBridge: React.FC<VSCodeWebBridgeProps> = ({
  workspaceId,
  workspacePath = "/workspace",
  onReady,
  onError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // VS Code Web URL with workspace configuration
    const vscodeUrl = new URL("http://localhost:8080");

    // Pass workspace configuration via URL parameters
    if (workspaceId) {
      vscodeUrl.searchParams.set("workspaceId", workspaceId);
    }
    if (workspacePath) {
      vscodeUrl.searchParams.set("folder", workspacePath);
    }

    // Set iframe source
    iframe.src = vscodeUrl.toString();

    // Handle iframe load
    const handleLoad = () => {
      console.log("✅ VS Code Web loaded successfully");
      setIsLoading(false);

      // Send initial configuration to VS Code
      sendMessageToVSCode({
        type: "init",
        payload: {
          workspaceId,
          workspacePath,
          theme: "vs-dark",
          // Pass TrackCodex auth token for API calls
          authToken: localStorage.getItem("trackcodex_token"),
        },
      });

      onReady?.();
    };

    const handleError = () => {
      const error = new Error(
        "Failed to load VS Code Web. Is the server running on http://localhost:8080?",
      );
      console.error("❌", error.message);
      setLoadError(error.message);
      setIsLoading(false);
      onError?.(error);
    };

    iframe.addEventListener("load", handleLoad);
    iframe.addEventListener("error", handleError);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("error", handleError);
    };
  }, [workspaceId, workspacePath, onReady, onError]);

  // Listen for messages from VS Code Web
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only accept messages from VS Code Web server
      if (event.origin !== "http://localhost:8080") {
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case "vscode-ready":
          console.log("🎉 VS Code Web is ready");
          break;

        case "workspace-changed":
          console.log("📁 Workspace changed:", payload.workspacePath);
          break;

        case "file-opened":
          console.log("📄 File opened:", payload.filePath);
          break;

        case "extension-installed":
          console.log("🧩 Extension installed:", payload.extensionId);
          break;

        case "error":
          console.error("❌ VS Code error:", payload.message);
          break;

        default:
          console.log("📨 VS Code message:", type, payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Helper to send messages to VS Code Web
  const sendMessageToVSCode = (message: { type: string; payload?: any }) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) {
      console.warn("⚠️ Cannot send message: VS Code iframe not ready");
      return;
    }

    iframe.contentWindow.postMessage(message, "http://localhost:8080");
  };

  // Handle workspace switching
  useEffect(() => {
    if (!isLoading && workspaceId) {
      sendMessageToVSCode({
        type: "switch-workspace",
        payload: {
          workspaceId,
          workspacePath,
        },
      });
    }
  }, [workspaceId, workspacePath, isLoading]);

  return (
    <div className="w-full h-full relative bg-[#1e1e1e]">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-[#007fd4] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-[#cccccc] text-sm">Loading TrackCodex IDE...</p>
            <p className="text-[#858585] text-xs mt-2">
              Powered by VS Code OSS
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] z-10">
          <div className="text-center max-w-md px-6">
            <div className="mb-4">
              <span className="material-symbols-outlined text-[#f48771] text-[64px]">
                error
              </span>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Failed to Load IDE
            </h3>
            <p className="text-[#cccccc] text-sm mb-4">{loadError}</p>
            <div className="text-left bg-[#2d2d2d] border border-[#3c3c3c] rounded-md p-4 text-xs">
              <p className="text-[#858585] mb-2">To fix this issue:</p>
              <ol className="list-decimal list-inside text-[#cccccc] space-y-1">
                <li>
                  Ensure VS Code Web is built:{" "}
                  <code className="bg-[#1e1e1e] px-1">
                    npm run build:vscode
                  </code>
                </li>
                <li>
                  Start VS Code Web server:{" "}
                  <code className="bg-[#1e1e1e] px-1">
                    npm run serve:vscode
                  </code>
                </li>
                <li>
                  Verify it's running on{" "}
                  <code className="bg-[#1e1e1e] px-1">
                    http://localhost:8080
                  </code>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* VS Code Web Iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="TrackCodex IDE (VS Code OSS)"
        allow="cross-origin-isolated; clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
      />
    </div>
  );
};

export default VSCodeWebBridge;
