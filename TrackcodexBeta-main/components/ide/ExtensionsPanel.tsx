import React, { useState } from "react";

/**
 * Extension System for TrackCodex IDE
 * Manages Monaco language support, themes, and IDE plugins
 */

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: "language" | "theme" | "tool" | "debugger";
  installed: boolean;
  enabled: boolean;
  icon: string;
}

const AVAILABLE_EXTENSIONS: Extension[] = [
  // Language Support
  {
    id: "typescript",
    name: "TypeScript Support",
    description: "Full TypeScript and TSX language support with IntelliSense",
    author: "TrackCodex",
    version: "1.0.0",
    category: "language",
    installed: true,
    enabled: true,
    icon: "code",
  },
  {
    id: "javascript",
    name: "JavaScript Support",
    description: "JavaScript and JSX language support",
    author: "TrackCodex",
    version: "1.0.0",
    category: "language",
    installed: true,
    enabled: true,
    icon: "code",
  },
  {
    id: "python",
    name: "Python Support",
    description: "Python language support with IntelliSense",
    author: "TrackCodex",
    version: "1.0.0",
    category: "language",
    installed: true,
    enabled: true,
    icon: "code",
  },
  {
    id: "json",
    name: "JSON Support",
    description: "JSON language support with validation",
    author: "TrackCodex",
    version: "1.0.0",
    category: "language",
    installed: true,
    enabled: true,
    icon: "data_object",
  },
  {
    id: "markdown",
    name: "Markdown Support",
    description: "Markdown editing with preview",
    author: "TrackCodex",
    version: "1.0.0",
    category: "language",
    installed: true,
    enabled: true,
    icon: "description",
  },

  // Themes
  {
    id: "theme-dark-trackcodex",
    name: "TrackCodex Dark",
    description: "Official TrackCodex dark theme with purple/cyan accents",
    author: "TrackCodex",
    version: "1.0.0",
    category: "theme",
    installed: true,
    enabled: true,
    icon: "palette",
  },
  {
    id: "theme-monokai",
    name: "Monokai Pro",
    description: "Classic Monokai color scheme",
    author: "Community",
    version: "1.0.0",
    category: "theme",
    installed: false,
    enabled: false,
    icon: "palette",
  },
  {
    id: "theme-dracula",
    name: "Dracula",
    description: "Dark theme with vibrant colors",
    author: "Community",
    version: "1.0.0",
    category: "theme",
    installed: false,
    enabled: false,
    icon: "palette",
  },

  // Tools
  {
    id: "prettier",
    name: "Prettier",
    description: "Code formatter for consistent style",
    author: "Prettier",
    version: "3.0.0",
    category: "tool",
    installed: true,
    enabled: true,
    icon: "format_paint",
  },
  {
    id: "eslint",
    name: "ESLint",
    description: "JavaScript/TypeScript linter",
    author: "ESLint",
    version: "8.0.0",
    category: "tool",
    installed: true,
    enabled: true,
    icon: "check_circle",
  },
  {
    id: "git-lens",
    name: "GitLens",
    description: "Enhanced Git integration and blame annotations",
    author: "Community",
    version: "2.0.0",
    category: "tool",
    installed: false,
    enabled: false,
    icon: "visibility",
  },

  // Debuggers
  {
    id: "debugger-node",
    name: "Node.js Debugger",
    description: "Debug Node.js applications",
    author: "TrackCodex",
    version: "1.0.0",
    category: "debugger",
    installed: true,
    enabled: true,
    icon: "bug_report",
  },
  {
    id: "debugger-chrome",
    name: "Chrome Debugger",
    description: "Debug web applications in Chrome",
    author: "TrackCodex",
    version: "1.0.0",
    category: "debugger",
    installed: false,
    enabled: false,
    icon: "bug_report",
  },
];

const ExtensionsPanel: React.FC = () => {
  const [extensions, setExtensions] =
    useState<Extension[]>(AVAILABLE_EXTENSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Extensions", icon: "apps" },
    { id: "language", name: "Languages", icon: "code" },
    { id: "theme", name: "Themes", icon: "palette" },
    { id: "tool", name: "Tools", icon: "build" },
    { id: "debugger", name: "Debuggers", icon: "bug_report" },
  ];

  const filteredExtensions = extensions.filter((ext) => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || ext.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const installedCount = extensions.filter((e) => e.installed).length;
  const enabledCount = extensions.filter((e) => e.enabled).length;

  const toggleInstall = (id: string) => {
    setExtensions((prev) =>
      prev.map((ext) =>
        ext.id === id
          ? { ...ext, installed: !ext.installed, enabled: !ext.installed }
          : ext,
      ),
    );
  };

  const toggleEnable = (id: string) => {
    setExtensions((prev) =>
      prev.map((ext) =>
        ext.id === id ? { ...ext, enabled: !ext.enabled } : ext,
      ),
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-[#cccccc]">
      {/* Header */}
      <div className="p-4 border-b border-[#2d2d2d]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8b5cf6]">
              extension
            </span>
            Extensions
          </h2>
          <div className="flex gap-2 text-xs text-[#858585]">
            <span>{installedCount} installed</span>
            <span>•</span>
            <span>{enabledCount} enabled</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#858585] text-[16px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search extensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2d2d2d] border border-[#3c3c3c] rounded-md text-sm text-white placeholder-[#858585] focus:outline-none focus:border-[#8b5cf6]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#8b5cf6] text-white"
                  : "bg-[#2d2d2d] text-[#cccccc] hover:bg-[#3c3c3c]"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Extensions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredExtensions.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[64px] text-[#858585] mb-4">
              search_off
            </span>
            <p className="text-[#858585]">No extensions found</p>
          </div>
        ) : (
          filteredExtensions.map((ext) => (
            <div
              key={ext.id}
              className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-4 hover:border-[#8b5cf6]/50 transition-all"
            >
              {/* Extension Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      ext.installed ? "bg-[#8b5cf6]/20" : "bg-[#3c3c3c]"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        ext.installed ? "text-[#8b5cf6]" : "text-[#858585]"
                      }`}
                    >
                      {ext.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {ext.name}
                    </h3>
                    <p className="text-xs text-[#858585] line-clamp-2">
                      {ext.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#858585]">
                      <span>{ext.author}</span>
                      <span>•</span>
                      <span>v{ext.version}</span>
                      <span>•</span>
                      <span className="capitalize">{ext.category}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {ext.installed ? (
                    <>
                      <button
                        onClick={() => toggleEnable(ext.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          ext.enabled
                            ? "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                            : "bg-[#3c3c3c] text-[#cccccc] hover:bg-[#4c4c4c]"
                        }`}
                      >
                        {ext.enabled ? "Enabled" : "Enable"}
                      </button>
                      <button
                        onClick={() => toggleInstall(ext.id)}
                        className="px-3 py-1 rounded text-xs font-medium bg-[#3c3c3c] text-[#cccccc] hover:bg-[#ff5555] hover:text-white transition-all"
                      >
                        Uninstall
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleInstall(ext.id)}
                      className="px-3 py-1 rounded text-xs font-medium bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-all"
                    >
                      Install
                    </button>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {ext.installed && (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                      ext.enabled
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {ext.enabled ? "check_circle" : "pause_circle"}
                    </span>
                    {ext.enabled ? "Active" : "Inactive"}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExtensionsPanel;
