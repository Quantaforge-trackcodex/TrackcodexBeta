import React, { useState } from "react";

interface SecurityFeature {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    autoEnable: boolean;
}

const AhiCsSettings = () => {
    const [pushProtection, setPushProtection] = useState(false);
    const [privateVulnerability, setPrivateVulnerability] = useState({
        enabled: false,
        autoEnable: false,
    });
    const [dependencyGraph, setDependencyGraph] = useState({
        enabled: false,
        autoEnable: false,
    });
    const [dependabotAlerts, setDependabotAlerts] = useState({
        enabled: false,
        autoEnable: false,
    });
    const [dependabotSecurityUpdates, setDependabotSecurityUpdates] = useState({
        enabled: false,
        autoEnable: false,
    });
    const [groupedSecurityUpdates, setGroupedSecurityUpdates] = useState({
        enabled: false,
        autoEnable: false,
    });
    const [dependabotSelfHosted, setDependabotSelfHosted] = useState({
        enabled: false,
        autoEnable: false,
    });

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <header className="border-b border-gh-border pb-6">
                <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
                    Code security
                </h1>
                <p className="text-sm text-gh-text-secondary leading-relaxed">
                    Security and analysis features help keep your repositories secure and updated. By
                    enabling these features, you're granting us permission to perform read-only analysis
                    on your repositories.
                </p>
            </header>

            {/* User Section */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">User</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Security and analysis features help keep you secure and updated, wherever you are.
                    </p>
                </div>

                {/* Push protection for yourself */}
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">
                                Push protection for yourself
                            </h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Block commits that contain{" "}
                                <a href="#" className="text-primary hover:underline">
                                    supported secrets
                                </a>{" "}
                                across all public repositories on TrackCodex.
                            </p>
                        </div>
                        <button
                            onClick={() => setPushProtection(!pushProtection)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${pushProtection
                                    ? "bg-transparent border-gh-border text-gh-text-secondary hover:text-white hover:border-red-500/50 hover:bg-red-500/10"
                                    : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                }`}
                        >
                            {pushProtection ? "Disable" : "Enable"}
                        </button>
                    </div>
                </div>
            </section>

            {/* Repositories Section */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">Repositories</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Security and analysis features help keep your repositories secure and updated.
                    </p>
                </div>

                {/* Private vulnerability reporting */}
                <div className="p-6 border-b border-gh-border">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">
                                Private vulnerability reporting
                            </h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Allow your community to privately report potential security vulnerabilities to
                                maintainers and repository owners.{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Learn more about private vulnerability reporting.
                                </a>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setPrivateVulnerability({ ...privateVulnerability, enabled: false })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!privateVulnerability.enabled
                                        ? "bg-transparent border-red-500/50 text-red-400"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Disable all
                            </button>
                            <button
                                onClick={() =>
                                    setPrivateVulnerability({ ...privateVulnerability, enabled: true })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${privateVulnerability.enabled
                                        ? "bg-primary border-transparent text-white"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Enable all
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={privateVulnerability.autoEnable}
                            onChange={(e) =>
                                setPrivateVulnerability({
                                    ...privateVulnerability,
                                    autoEnable: e.target.checked,
                                })
                            }
                            className="w-4 h-4 rounded border-gh-border bg-gh-bg"
                        />
                        <span className="text-sm text-gh-text">
                            Automatically enable for new public repositories
                        </span>
                    </label>
                </div>

                {/* Dependency graph */}
                <div className="p-6 border-b border-gh-border">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">Dependency graph</h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Understand your dependencies.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDependencyGraph({ ...dependencyGraph, enabled: false })}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!dependencyGraph.enabled
                                        ? "bg-transparent border-red-500/50 text-red-400"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Disable all
                            </button>
                            <button
                                onClick={() => setDependencyGraph({ ...dependencyGraph, enabled: true })}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${dependencyGraph.enabled
                                        ? "bg-primary border-transparent text-white"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Enable all
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dependencyGraph.autoEnable}
                            onChange={(e) =>
                                setDependencyGraph({
                                    ...dependencyGraph,
                                    autoEnable: e.target.checked,
                                })
                            }
                            className="w-4 h-4 rounded border-gh-border bg-gh-bg"
                        />
                        <span className="text-sm text-gh-text">
                            Automatically enable for new repositories
                        </span>
                    </label>
                </div>

                {/* Dependabot Section */}
                <div className="p-6 border-b border-gh-border bg-gh-bg/50">
                    <h3 className="text-base font-bold text-gh-text mb-2">Dependabot</h3>
                    <p className="text-sm text-gh-text-secondary">
                        Keep your dependencies secure and up-to-date.{" "}
                        <a href="#" className="text-primary hover:underline">
                            Learn more about Dependabot.
                        </a>
                    </p>
                </div>

                {/* Dependabot alerts */}
                <div className="p-6 border-b border-gh-border">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">Dependabot alerts</h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Receive alerts for vulnerabilities that affect your dependencies and manually
                                generate Dependabot pull requests to resolve these vulnerabilities.{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Configure alert notifications.
                                </a>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDependabotAlerts({ ...dependabotAlerts, enabled: false })}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!dependabotAlerts.enabled
                                        ? "bg-transparent border-red-500/50 text-red-400"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Disable all
                            </button>
                            <button
                                onClick={() => setDependabotAlerts({ ...dependabotAlerts, enabled: true })}
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${dependabotAlerts.enabled
                                        ? "bg-primary border-transparent text-white"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Enable all
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dependabotAlerts.autoEnable}
                            onChange={(e) =>
                                setDependabotAlerts({
                                    ...dependabotAlerts,
                                    autoEnable: e.target.checked,
                                })
                            }
                            className="w-4 h-4 rounded border-gh-border bg-gh-bg"
                        />
                        <span className="text-sm text-gh-text">
                            Automatically enable for new repositories
                        </span>
                    </label>
                </div>

                {/* Dependabot security updates */}
                <div className="p-6 border-b border-gh-border">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">
                                Dependabot security updates
                            </h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Enabling this option will result in Dependabot automatically attempting to open
                                pull requests to resolve every Dependabot alert with an available patch.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setDependabotSecurityUpdates({ ...dependabotSecurityUpdates, enabled: false })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!dependabotSecurityUpdates.enabled
                                        ? "bg-transparent border-red-500/50 text-red-400"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Disable all
                            </button>
                            <button
                                onClick={() =>
                                    setDependabotSecurityUpdates({ ...dependabotSecurityUpdates, enabled: true })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${dependabotSecurityUpdates.enabled
                                        ? "bg-primary border-transparent text-white"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Enable all
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dependabotSecurityUpdates.autoEnable}
                            onChange={(e) =>
                                setDependabotSecurityUpdates({
                                    ...dependabotSecurityUpdates,
                                    autoEnable: e.target.checked,
                                })
                            }
                            className="w-4 h-4 rounded border-gh-border bg-gh-bg"
                        />
                        <span className="text-sm text-gh-text">
                            Automatically enable for new repositories
                        </span>
                    </label>
                </div>

                {/* Grouped security updates */}
                <div className="p-6 border-b border-gh-border">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">
                                Grouped security updates
                            </h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Groups all available updates that resolve a Dependabot alert into one pull
                                request (per package manager and directory of requirements manifest). This option
                                may be overridden by group rules specified in dependabot.yml -{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Learn how to group updates.
                                </a>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setGroupedSecurityUpdates({ ...groupedSecurityUpdates, enabled: false })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!groupedSecurityUpdates.enabled
                                        ? "bg-transparent border-red-500/50 text-red-400"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Disable all
                            </button>
                            <button
                                onClick={() =>
                                    setGroupedSecurityUpdates({ ...groupedSecurityUpdates, enabled: true })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${groupedSecurityUpdates.enabled
                                        ? "bg-primary border-transparent text-white"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Enable all
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={groupedSecurityUpdates.autoEnable}
                            onChange={(e) =>
                                setGroupedSecurityUpdates({
                                    ...groupedSecurityUpdates,
                                    autoEnable: e.target.checked,
                                })
                            }
                            className="w-4 h-4 rounded border-gh-border bg-gh-bg"
                        />
                        <span className="text-sm text-gh-text">
                            Automatically enable for new repositories
                        </span>
                    </label>
                </div>

                {/* Dependabot on self-hosted runners */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">
                                Dependabot on self-hosted runners
                            </h3>
                            <p className="text-sm text-gh-text-secondary mb-2">
                                Run Dependabot security and version updates on self-hosted Actions runners.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setDependabotSelfHosted({ ...dependabotSelfHosted, enabled: false })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${!dependabotSelfHosted.enabled
                                        ? "bg-transparent border-red-500/50 text-red-400"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Disable all
                            </button>
                            <button
                                onClick={() =>
                                    setDependabotSelfHosted({ ...dependabotSelfHosted, enabled: true })
                                }
                                className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${dependabotSelfHosted.enabled
                                        ? "bg-primary border-transparent text-white"
                                        : "bg-gh-bg border-gh-border text-gh-text hover:bg-gh-bg-tertiary"
                                    }`}
                            >
                                Enable all
                            </button>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dependabotSelfHosted.autoEnable}
                            onChange={(e) =>
                                setDependabotSelfHosted({
                                    ...dependabotSelfHosted,
                                    autoEnable: e.target.checked,
                                })
                            }
                            className="w-4 h-4 rounded border-gh-border bg-gh-bg"
                        />
                        <span className="text-sm text-gh-text">
                            Automatically enable for new repositories
                        </span>
                    </label>
                </div>
            </section>
        </div>
    );
};

export default AhiCsSettings;
