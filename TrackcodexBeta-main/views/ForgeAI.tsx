import React, { useState, useEffect } from "react";

type Provider = "google" | "deepseek";

interface DeepSeekConfig {
  serverUrl: string;
  apiKey: string;
  model: string;
}

const ForgeAIView = () => {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ type: string; content: string }[]>(
    [],
  );
  const [showSettings, setShowSettings] = useState(false);

  // Provider settings
  const [provider, setProvider] = useState<Provider>("google");
  const [deepseekConfig, setDeepseekConfig] = useState<DeepSeekConfig>({
    serverUrl: "http://localhost:8000",
    apiKey: "",
    model: "deepseek-coder",
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "testing" | "connected" | "failed"
  >("idle");

  // Load settings from localStorage
  useEffect(() => {
    const savedProvider = localStorage.getItem("forgeai_provider") as Provider;
    const savedConfig = localStorage.getItem("forgeai_deepseek_config");

    if (savedProvider) setProvider(savedProvider);
    if (savedConfig) setDeepseekConfig(JSON.parse(savedConfig));
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("forgeai_provider", provider);
    localStorage.setItem(
      "forgeai_deepseek_config",
      JSON.stringify(deepseekConfig),
    );
    setShowSettings(false);
  };

  // Test DeepSeek connection
  const testConnection = async () => {
    setConnectionStatus("testing");
    try {
      const response = await fetch(
        `${deepseekConfig.serverUrl}/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(deepseekConfig.apiKey && {
              Authorization: `Bearer ${deepseekConfig.apiKey}`,
            }),
          },
          body: JSON.stringify({
            model: deepseekConfig.model,
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 10,
          }),
        },
      );

      if (response.ok) {
        setConnectionStatus("connected");
        setTimeout(() => setConnectionStatus("idle"), 3000);
      } else {
        setConnectionStatus("failed");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("failed");
    }
  };

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/v1/forgeai/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider,
          model:
            provider === "google" ? "gemini-1.5-flash" : deepseekConfig.model,
          workspaceId: localStorage.getItem("current_workspace_id"), // Try to get context
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Orchestrator error: ${response.status}`);
      }

      const data = await response.json();
      setResults((prev) => [{ type: "AI", content: data.content }, ...prev]);
      setPrompt("");
    } catch (error) {
      console.error(error);
      setResults((prev) => [
        {
          type: "Error",
          content: `Failed to connect to ForgeAI Orchestrator. ${error instanceof Error ? error.message : ""}`,
        },
        ...prev,
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gh-bg font-display">
      <div className="p-8 border-b border-gh-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary filled">
              auto_awesome
            </span>
            ForgeAI Insights
            <span className="text-xs font-normal text-gh-text-secondary ml-2">
              ({provider === "google" ? "Google GenAI" : "DeepSeek Coder"})
            </span>
          </h1>
          <p className="text-gh-text-secondary text-sm mt-1">
            Your advanced engineering co-pilot for code analysis and project
            strategy.
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="size-10 bg-gh-bg-secondary border border-gh-border rounded-xl flex items-center justify-center hover:bg-gh-bg transition-colors"
          title="Settings"
        >
          <span className="material-symbols-outlined text-gh-text-secondary">
            settings
          </span>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gh-bg-secondary border-b border-gh-border p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-lg font-bold text-gh-text mb-4">
              AI Provider Settings
            </h3>

            {/* Provider Selection */}
            <div>
              <label className="text-sm font-medium text-gh-text-secondary block mb-2">
                Provider
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    value="google"
                    checked={provider === "google"}
                    onChange={(e) => setProvider(e.target.value as Provider)}
                    className="accent-primary"
                  />
                  <span className="text-gh-text-secondary">Google GenAI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    value="deepseek"
                    checked={provider === "deepseek"}
                    onChange={(e) => setProvider(e.target.value as Provider)}
                    className="accent-primary"
                  />
                  <span className="text-gh-text-secondary">
                    DeepSeek (Local)
                  </span>
                </label>
              </div>
            </div>

            {/* DeepSeek Configuration */}
            {provider === "deepseek" && (
              <div className="space-y-4 p-4 bg-gh-bg rounded-xl border border-gh-border">
                <div>
                  <label className="text-sm font-medium text-gh-text-secondary block mb-2">
                    Server URL
                  </label>
                  <input
                    type="text"
                    value={deepseekConfig.serverUrl}
                    onChange={(e) =>
                      setDeepseekConfig({
                        ...deepseekConfig,
                        serverUrl: e.target.value,
                      })
                    }
                    placeholder="http://192.168.1.100:8000"
                    className="w-full bg-gh-bg-secondary border border-gh-border rounded-lg px-4 py-2 text-gh-text focus:ring-1 focus:ring-primary outline-none"
                  />
                  <p className="text-xs text-gh-text-secondary mt-1">
                    URL of your DeepSeek server (e.g.,
                    http://192.168.1.100:8000)
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gh-text-secondary block mb-2">
                    API Key (Optional)
                  </label>
                  <input
                    type="password"
                    value={deepseekConfig.apiKey}
                    onChange={(e) =>
                      setDeepseekConfig({
                        ...deepseekConfig,
                        apiKey: e.target.value,
                      })
                    }
                    placeholder="Leave empty if not required"
                    className="w-full bg-gh-bg-secondary border border-gh-border rounded-lg px-4 py-2 text-gh-text focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gh-text-secondary block mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={deepseekConfig.model}
                    onChange={(e) =>
                      setDeepseekConfig({
                        ...deepseekConfig,
                        model: e.target.value,
                      })
                    }
                    placeholder="deepseek-coder"
                    className="w-full bg-gh-bg-secondary border border-gh-border rounded-lg px-4 py-2 text-gh-text focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <button
                  onClick={testConnection}
                  disabled={connectionStatus === "testing"}
                  className="flex items-center gap-2 px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-lg text-gh-text-secondary hover:bg-gh-bg transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    {connectionStatus === "testing"
                      ? "progress_activity"
                      : connectionStatus === "connected"
                        ? "check_circle"
                        : connectionStatus === "failed"
                          ? "error"
                          : "wifi"}
                  </span>
                  {connectionStatus === "testing"
                    ? "Testing..."
                    : connectionStatus === "connected"
                      ? "Connected!"
                      : connectionStatus === "failed"
                        ? "Connection Failed"
                        : "Test Connection"}
                </button>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-lg text-gh-text-secondary hover:bg-gh-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {results.length === 0 && (
            <div className="py-20 text-center">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                <span className="material-symbols-outlined !text-[40px] filled">
                  psychology
                </span>
              </div>
              <h2 className="text-xl font-bold text-gh-text mb-2">
                How can I assist you today?
              </h2>
              <p className="text-gh-text-secondary max-w-sm mx-auto">
                Ask about architecture, security vulnerabilities, or refactoring
                opportunities in your current workspace.
              </p>
            </div>
          )}

          {results.map((res, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${res.type === "Error" ? "border-red-500/20 bg-red-500/5 text-red-400" : "border-gh-border bg-gh-bg-secondary text-gh-text-secondary"}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-xs filled text-primary">
                  auto_awesome
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  ForgeAI Response
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                {res.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-gh-bg-secondary border-t border-gh-border">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleAsk())
            }
            placeholder="Ask ForgeAI for technical insights or security analysis..."
            className="w-full bg-gh-bg border border-gh-border rounded-2xl p-5 pr-20 text-gh-text focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-none"
          />
          <button
            onClick={handleAsk}
            disabled={isAnalyzing || !prompt.trim()}
            className="absolute right-4 bottom-4 size-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined ${isAnalyzing ? "animate-spin" : ""}`}
            >
              {isAnalyzing ? "progress_activity" : "send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgeAIView;
