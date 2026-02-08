import React, { useState, useEffect } from "react";

interface DependencyNode {
  name: string;
  version?: string;
  type: "runtime" | "dev" | "peer" | "optional";
}

interface DependencyGraph {
  totalCount: number;
  byType: Record<string, number>;
  packages: DependencyNode[];
  lastAnalyzed?: string;
  manifests: string[];
}

interface RepoDependencyGraphProps {
  repoId: string;
}

const RepoDependencyGraph: React.FC<RepoDependencyGraphProps> = ({
  repoId,
}) => {
  const [graph, setGraph] = useState<DependencyGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchDependencies();
  }, [repoId]);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/dependencies`);
      const data = await res.json();
      setGraph(data);
    } catch (err) {
      console.error("Failed to fetch dependencies", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/dependencies/analyze`,
        {
          method: "POST",
        },
      );
      const data = await res.json();
      setGraph(data);
    } catch (err) {
      console.error("Failed to analyze dependencies", err);
      alert("Failed to analyze dependencies");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasData = graph && graph.totalCount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gh-text">Dependency Graph</h3>
          <p className="text-sm text-gh-text-secondary mt-1">
            {hasData
              ? `${graph.totalCount} dependencies found`
              : "No dependencies analyzed yet"}
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span
            className={`material-symbols-outlined !text-[18px] ${analyzing ? "animate-spin" : ""}`}
          >
            {analyzing ? "sync" : "analytics"}
          </span>
          {analyzing ? "Analyzing..." : "Analyze Dependencies"}
        </button>
      </div>

      {hasData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <div className="text-2xl font-bold text-primary">
                {graph.totalCount}
              </div>
              <div className="text-xs text-gh-text-secondary mt-1">
                Total Dependencies
              </div>
            </div>
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-500">
                {graph.byType.runtime || 0}
              </div>
              <div className="text-xs text-gh-text-secondary mt-1">Runtime</div>
            </div>
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-500">
                {graph.byType.dev || 0}
              </div>
              <div className="text-xs text-gh-text-secondary mt-1">
                Development
              </div>
            </div>
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <div className="text-2xl font-bold text-gh-text">
                {graph.manifests.length}
              </div>
              <div className="text-xs text-gh-text-secondary mt-1">
                Manifest Files
              </div>
            </div>
          </div>

          {/* Manifests */}
          {graph.manifests.length > 0 && (
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-4">
              <h4 className="text-sm font-bold text-gh-text mb-3">
                Detected Manifests
              </h4>
              <div className="flex flex-wrap gap-2">
                {graph.manifests.map((manifest) => (
                  <span
                    key={manifest}
                    className="px-3 py-1 bg-gh-bg border border-gh-border rounded-full text-xs font-mono text-gh-text"
                  >
                    {manifest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dependency List */}
          <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gh-border">
              <h4 className="text-sm font-bold text-gh-text">
                All Dependencies
              </h4>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gh-bg-tertiary sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-bold text-gh-text-secondary">
                      Package
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-gh-text-secondary">
                      Version
                    </th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-gh-text-secondary">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {graph.packages.map((pkg, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gh-border hover:bg-gh-bg-tertiary"
                    >
                      <td className="px-4 py-2 text-sm font-mono text-gh-text">
                        {pkg.name}
                      </td>
                      <td className="px-4 py-2 text-sm font-mono text-gh-text-secondary">
                        {pkg.version || "—"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${pkg.type === "runtime"
                              ? "bg-blue-500/20 text-blue-500"
                              : pkg.type === "dev"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-gray-500/20 text-gray-500"
                            }`}
                        >
                          {pkg.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {graph.lastAnalyzed && (
            <p className="text-xs text-gh-text-secondary text-center">
              Last analyzed: {new Date(graph.lastAnalyzed).toLocaleString()}
            </p>
          )}
        </>
      )}

      {!hasData && (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-16 text-center">
          <span className="material-symbols-outlined !text-[64px] text-gh-text-secondary opacity-30">
            account_tree
          </span>
          <h4 className="text-lg font-bold text-gh-text mt-4">
            No Dependencies Analyzed
          </h4>
          <p className="text-sm text-gh-text-secondary mt-2 max-w-md mx-auto">
            Click "Analyze Dependencies" to scan your repository for package
            manifests and build the dependency graph.
          </p>
        </div>
      )}
    </div>
  );
};

export default RepoDependencyGraph;
