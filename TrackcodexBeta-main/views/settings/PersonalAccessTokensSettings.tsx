import React, { useState, useEffect } from "react";
import { PersonalAccessToken } from "../../types";
import EmptyState from "../../components/common/EmptyState";

const TOKEN_STORAGE_KEY = "trackcodex_pat_tokens";

// --- Helper Functions ---
const generateTokenString = () =>
  `tcx_live_${[...Array(32)].map(() => Math.random().toString(36)[2]).join("")}`;

const SCOPES = [
  {
    id: "repo:read",
    label: "repo:read",
    description: "Full access to public and private repositories.",
  },
  {
    id: "workflow:write",
    label: "workflow:write",
    description: "Update GitHub Action workflow files.",
  },
  {
    id: "user:email",
    label: "user:email",
    description: "Access to user's primary email address.",
  },
  {
    id: "admin:org",
    label: "admin:org",
    description: "Full control of organizations and their members.",
  },
  {
    id: "delete_repo",
    label: "delete_repo",
    description: "Grants ability to delete repositories.",
  },
];

// --- Sub-Components for Different Views ---

const GeneratedTokenView = ({
  token,
  name,
  scopes,
  onBack,
}: {
  token: string;
  name: string;
  scopes: string[];
  onBack: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="p-4 bg-[#052c15] border border-[#2b6a3d] rounded-lg flex items-start gap-3">
        <span className="material-symbols-outlined text-[#3fb950] mt-1">
          check_circle
        </span>
        <div>
          <h3 className="font-bold text-white">
            Personal access token generated
          </h3>
          <p className="text-sm text-gh-text-secondary mt-1">
            Make sure to copy your personal access token now. You won’t be able
            to see it again!
          </p>
        </div>
      </div>

      <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">
          New Token: <span className="text-emerald-400">{name}</span>
        </h2>
        <div className="flex items-center gap-3 p-3 bg-gh-bg border border-gh-border rounded-md">
          <span className="font-mono text-sm text-slate-400 flex-1 truncate">
            {token}
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-1.5 bg-gh-bg-tertiary border border-gh-border text-gh-text hover:bg-gh-bg-secondary rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined !text-sm">
              {copied ? "done" : "content_copy"}
            </span>
            {copied ? "Copied!" : "Copy Token"}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gh-text-secondary mb-4">
            Assigned Scopes
          </h3>
          <div className="space-y-3">
            {scopes.map((scopeId) => {
              const scopeInfo = SCOPES.find((s) => s.id === scopeId);
              return (
                <div key={scopeId} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-500 !text-lg">
                    check
                  </span>
                  <div>
                    <p className="font-mono text-sm text-white">
                      {scopeInfo?.label}
                    </p>
                    <p className="text-xs text-gh-text-secondary">
                      {scopeInfo?.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gh-border">
          <p className="text-sm text-gh-text-secondary">
            Treat this token like a password. Never share it publicly.
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-primary font-bold hover:underline"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back to all tokens
      </button>
    </div>
  );
};

const PersonalAccessTokensSettings = () => {
  const [view, setView] = useState<"list" | "generate" | "generated">("list");
  const [tokens, setTokens] = useState<PersonalAccessToken[]>([]);
  const [newToken, setNewToken] = useState<{
    token: string;
    name: string;
    scopes: string[];
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    expiration: "30",
    scopes: new Set<string>(),
  });

  useEffect(() => {
    try {
      const savedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (savedTokens) {
        setTokens(JSON.parse(savedTokens));
      }
    } catch (e) {
      console.error("Failed to parse tokens from localStorage", e);
    }
  }, []);

  const handleGenerate = () => {
    const tokenString = generateTokenString();
    // FIX: Use spread syntax to ensure correct type inference from Set<string> to string[].
    const selectedScopes = [...formData.scopes];
    const expirationDays = parseInt(formData.expiration, 10);
    const expiresAt = isNaN(expirationDays)
      ? null
      : Date.now() + expirationDays * 24 * 60 * 60 * 1000;

    const newTokenData: PersonalAccessToken = {
      id: `token_${Date.now()}`,
      name: formData.name,
      tokenPreview: `${tokenString.slice(0, 12)}...`,
      scopes: selectedScopes,
      expiresAt,
      createdAt: Date.now(),
    };

    const updatedTokens = [...tokens, newTokenData];
    setTokens(updatedTokens);
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens));

    setNewToken({
      token: tokenString,
      name: formData.name,
      scopes: selectedScopes,
    });
    setView("generated");
  };

  const handleDelete = (tokenId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this token? This action is irreversible.",
      )
    ) {
      const updatedTokens = tokens.filter((t) => t.id !== tokenId);
      setTokens(updatedTokens);
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(updatedTokens));
    }
  };

  if (view === "generated" && newToken) {
    return (
      <GeneratedTokenView
        {...newToken}
        onBack={() => {
          setNewToken(null);
          setView("list");
        }}
      />
    );
  }

  if (view === "generate") {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <header>
          <h1 className="text-2xl font-black text-white tracking-tight">
            New personal access token
          </h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Configure the details for your new API token.
          </p>
        </header>
        <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl space-y-6">
          <div>
            <label className="text-sm font-bold text-white block mb-2">
              Note
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="e.g., Deployment-Bot-Alpha"
              className="w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-white block mb-2">
              Expiration
            </label>
            <select
              value={formData.expiration}
              aria-label="Expiration"
              onChange={(e) =>
                setFormData((f) => ({ ...f, expiration: e.target.value }))
              }
              className="bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="no-expiry">No expiration</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-white block mb-2">
              Select scopes
            </label>
            <div className="space-y-3">
              {SCOPES.map((scope) => (
                <label
                  key={scope.id}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 form-checkbox bg-gh-bg border-gh-border text-primary focus:ring-primary"
                    onChange={(e) => {
                      const newScopes = new Set(formData.scopes);
                      if (e.target.checked) newScopes.add(scope.id);
                      else newScopes.delete(scope.id);
                      setFormData((f) => ({ ...f, scopes: newScopes }));
                    }}
                  />
                  <div>
                    <p className="font-mono text-sm text-white">
                      {scope.label}
                    </p>
                    <p className="text-xs text-gh-text-secondary">
                      {scope.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-blue-600 transition-all"
          >
            Generate token
          </button>
          <button
            onClick={() => setView("list")}
            className="px-6 py-2 text-sm font-bold text-gh-text-secondary hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between pb-6 border-b border-gh-border">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Personal access tokens
          </h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Tokens you have generated that can be used to access the TrackCodex
            API.
          </p>
        </div>
        <button
          onClick={() => setView("generate")}
          className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:brightness-110"
        >
          Generate new token
        </button>
      </header>

      {tokens.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-gh-border rounded-2xl bg-gh-bg-secondary/30">
          <EmptyState />
        </div>
      ) : (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="p-5 border-b border-gh-border last:border-0 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-gh-text-secondary !text-3xl">
                  key
                </span>
                <div>
                  <h4 className="text-base font-bold text-emerald-400">
                    {token.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-gh-text-secondary font-mono">
                      {token.tokenPreview}
                    </span>
                    <span className="text-gh-text-secondary">
                      {token.expiresAt
                        ? // eslint-disable-next-line
                        `Expires in ${Math.ceil((token.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))} days`
                        : "Never expires"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-4 py-1.5 bg-gh-bg-tertiary border border-gh-border text-gh-text text-xs font-bold rounded-lg">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(token.id)}
                  className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalAccessTokensSettings;
