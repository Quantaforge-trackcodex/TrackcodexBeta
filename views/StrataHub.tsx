import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_STRATA } from "../constants";
import { Strata } from "../types";
import { strataNetworkApi, StrataNetwork } from "../services/strata";

// Strata Card Component
const StrataCard: React.FC<{ strata: Strata }> = ({ strata }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/strata/${strata.id}`)}
            className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 hover:border-gh-border-active transition-all cursor-pointer group hover:shadow-lg hover:shadow-black/20"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img
                        src={strata.avatar}
                        alt={strata.name}
                        className="size-12 rounded-lg border border-gh-border object-cover group-hover:scale-105 transition-transform"
                    />
                    <div>
                        <h3 className="text-lg font-bold text-gh-text group-hover:text-primary transition-colors">
                            {strata.name}
                        </h3>
                        <p className="text-sm text-gh-text-secondary">
                            {strata.location || "Remote"}
                        </p>
                    </div>
                </div>
                <span className="bg-gh-bg border border-gh-border text-gh-text-secondary text-xs px-2.5 py-1 rounded-full font-medium">
                    {strata.members.length} members
                </span>
            </div>

            <p className="text-sm text-gh-text-secondary mb-6 line-clamp-2 leading-relaxed">
                {strata.description}
            </p>

            <div className="flex items-center gap-4 border-t border-gh-border pt-4">
                <div className="flex items-center gap-1.5 text-xs text-gh-text-secondary">
                    <span className="material-symbols-outlined !text-[16px]">
                        folder_open
                    </span>
                    <span className="font-medium text-gh-text">
                        {strata.repositories.length}
                    </span>{" "}
                    repositories
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gh-text-secondary">
                    <span className="material-symbols-outlined !text-[16px]">groups</span>
                    <span className="font-medium text-gh-text">
                        {strata.teams.length}
                    </span>{" "}
                    teams
                </div>
            </div>
        </div>
    );
};

// Strata Network Card Component
const StrataNetworkCard: React.FC<{ network: StrataNetwork }> = ({ network }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/network/${network.slug}`)}
            className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="size-14 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-white text-xl">
                    {network.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gh-text group-hover:text-primary transition-colors truncate">
                        {network.name}
                    </h3>
                    <span className="text-xs text-gh-text-secondary uppercase tracking-widest">
                        {network.plan} Plan
                    </span>
                </div>
                <span className="material-symbols-outlined text-gh-text-secondary group-hover:text-primary transition-colors">
                    arrow_forward
                </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gh-border">
                <div className="text-center">
                    <div className="text-lg font-bold text-gh-text">
                        {network._count?.members || 0}
                    </div>
                    <div className="text-xs text-gh-text-secondary">Members</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-gh-text">
                        {network.strata?.length || 0}
                    </div>
                    <div className="text-xs text-gh-text-secondary">Strata</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-400">98%</div>
                    <div className="text-xs text-gh-text-secondary">Security</div>
                </div>
            </div>
        </div>
    );
};

const StrataHub = () => {
    const navigate = useNavigate();
    const [networks, setNetworks] = useState<StrataNetwork[]>([]);
    const [loadingNetworks, setLoadingNetworks] = useState(true);

    useEffect(() => {
        loadNetworks();
    }, []);

    const loadNetworks = async () => {
        try {
            const data = await strataNetworkApi.getMyNetworks();
            setNetworks(data);
        } catch (error) {
            console.error("Failed to load networks:", error);
            setNetworks([]);
        } finally {
            setLoadingNetworks(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gh-bg p-8 font-display">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gh-text tracking-tight mb-2">
                        StrataHub
                    </h1>
                    <p className="text-gh-text-secondary text-lg">
                        Manage your strata and network accounts from one unified hub.
                    </p>
                </div>

                {/* Strata Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gh-text flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">
                                    corporate_fare
                                </span>
                                Strata
                            </h2>
                            <p className="text-sm text-gh-text-secondary mt-1">
                                Your personal and team strata
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/strata/new")}
                            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Strata
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_STRATA.length === 0 ? (
                            <div className="col-span-full py-16 border-2 border-dashed border-gh-border rounded-2xl text-center">
                                <span className="material-symbols-outlined text-6xl text-gh-text-secondary mb-4 block">
                                    corporate_fare
                                </span>
                                <h3 className="text-lg font-bold text-gh-text mb-2">
                                    No strata yet
                                </h3>
                                <p className="text-gh-text-secondary mb-4">
                                    Create your first strata to get started
                                </p>
                                <button
                                    onClick={() => navigate("/strata/new")}
                                    className="bg-gh-bg-secondary hover:bg-gh-bg-tertiary text-gh-text px-5 py-2 rounded-lg font-bold text-sm border border-gh-border transition-all"
                                >
                                    Create Strata
                                </button>
                            </div>
                        ) : (
                            MOCK_STRATA.map((strata) => (
                                <StrataCard key={strata.id} strata={strata} />
                            ))
                        )}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gh-border mb-12" />

                {/* Network Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gh-text flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">
                                    domain
                                </span>
                                Strata Network
                            </h2>
                            <p className="text-sm text-gh-text-secondary mt-1">
                                Enterprise-grade features and management
                            </p>
                        </div>
                        {networks.length > 0 && (
                            <button
                                onClick={() => navigate("/network/new")}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                New Network
                            </button>
                        )}
                    </div>

                    {loadingNetworks ? (
                        <div className="py-16 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gh-border border-t-primary"></div>
                            <p className="text-gh-text-secondary mt-4">Loading networks...</p>
                        </div>
                    ) : networks.length === 0 ? (
                        <div className="py-16 border-2 border-dashed border-gh-border rounded-2xl text-center bg-gradient-to-br from-purple-500/5 to-blue-600/5">
                            <span className="material-symbols-outlined text-6xl text-purple-500 mb-4 block">
                                domain
                            </span>
                            <h3 className="text-lg font-bold text-gh-text mb-2">
                                Unlock Network Features
                            </h3>
                            <p className="text-gh-text-secondary mb-6 max-w-md mx-auto">
                                Get advanced security, compliance tools, premium support, and localized
                                management for your organization.
                            </p>
                            <button
                                onClick={() => navigate("/network/new")}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 mx-auto"
                            >
                                <span className="material-symbols-outlined">rocket_launch</span>
                                Create Network
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                                    New
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {networks.map((network) => (
                                <StrataNetworkCard key={network.id} network={network} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StrataHub;
