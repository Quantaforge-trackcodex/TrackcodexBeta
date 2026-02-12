import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_ORGANIZATIONS } from "../constants";
import { Organization } from "../types";
import { enterpriseApi, Enterprise } from "../services/enterprise";

// Organization Card Component
const OrganizationCard: React.FC<{ org: Organization }> = ({ org }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/org/${org.id}`)}
            className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer flex items-center gap-4"
        >
            <img
                src={org.avatar}
                alt={org.name}
                className="size-14 rounded-lg border-2 border-gh-border p-1 object-cover"
            />
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gh-text group-hover:text-primary transition-colors truncate">
                    {org.name}
                </h3>
                <p className="text-sm text-gh-text-secondary mt-1 line-clamp-1">
                    {org.description}
                </p>
            </div>
            <span className="material-symbols-outlined text-gh-text-secondary group-hover:text-primary transition-colors">
                arrow_forward
            </span>
        </div>
    );
};

// Enterprise Card Component
const EnterpriseCard: React.FC<{ enterprise: Enterprise }> = ({ enterprise }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/enterprise/${enterprise.slug}`)}
            className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="size-14 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-white text-xl">
                    {enterprise.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gh-text group-hover:text-primary transition-colors truncate">
                        {enterprise.name}
                    </h3>
                    <span className="text-xs text-gh-text-secondary uppercase tracking-widest">
                        {enterprise.plan} Plan
                    </span>
                </div>
                <span className="material-symbols-outlined text-gh-text-secondary group-hover:text-primary transition-colors">
                    arrow_forward
                </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gh-border">
                <div className="text-center">
                    <div className="text-lg font-bold text-gh-text">
                        {enterprise._count?.members || 0}
                    </div>
                    <div className="text-xs text-gh-text-secondary">Members</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-gh-text">
                        {enterprise.organizations?.length || 0}
                    </div>
                    <div className="text-xs text-gh-text-secondary">Orgs</div>
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
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [loadingEnterprises, setLoadingEnterprises] = useState(true);

    useEffect(() => {
        loadEnterprises();
    }, []);

    const loadEnterprises = async () => {
        try {
            const data = await enterpriseApi.getMyEnterprises();
            setEnterprises(data);
        } catch (error) {
            console.error("Failed to load enterprises:", error);
            setEnterprises([]);
        } finally {
            setLoadingEnterprises(false);
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
                        Manage your organizations and enterprise accounts from one unified hub.
                    </p>
                </div>

                {/* Organizations Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gh-text flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">
                                    corporate_fare
                                </span>
                                Organizations
                            </h2>
                            <p className="text-sm text-gh-text-secondary mt-1">
                                Your personal and team organizations
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/organizations/new")}
                            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            New Organization
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_ORGANIZATIONS.length === 0 ? (
                            <div className="col-span-full py-16 border-2 border-dashed border-gh-border rounded-2xl text-center">
                                <span className="material-symbols-outlined text-6xl text-gh-text-secondary mb-4 block">
                                    corporate_fare
                                </span>
                                <h3 className="text-lg font-bold text-gh-text mb-2">
                                    No organizations yet
                                </h3>
                                <p className="text-gh-text-secondary mb-4">
                                    Create your first organization to get started
                                </p>
                                <button
                                    onClick={() => navigate("/organizations/new")}
                                    className="bg-gh-bg-secondary hover:bg-gh-bg-tertiary text-gh-text px-5 py-2 rounded-lg font-bold text-sm border border-gh-border transition-all"
                                >
                                    Create Organization
                                </button>
                            </div>
                        ) : (
                            MOCK_ORGANIZATIONS.map((org) => (
                                <OrganizationCard key={org.id} org={org} />
                            ))
                        )}
                    </div>
                </section>

                {/* Divider */}
                <div className="h-px bg-gh-border mb-12" />

                {/* Enterprise Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gh-text flex items-center gap-2">
                                <span className="material-symbols-outlined text-purple-500">
                                    domain
                                </span>
                                Enterprise
                            </h2>
                            <p className="text-sm text-gh-text-secondary mt-1">
                                Enterprise-grade features and management
                            </p>
                        </div>
                        {enterprises.length > 0 && (
                            <button
                                onClick={() => navigate("/enterprise/new")}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                New Enterprise
                            </button>
                        )}
                    </div>

                    {loadingEnterprises ? (
                        <div className="py-16 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gh-border border-t-primary"></div>
                            <p className="text-gh-text-secondary mt-4">Loading enterprises...</p>
                        </div>
                    ) : enterprises.length === 0 ? (
                        <div className="py-16 border-2 border-dashed border-gh-border rounded-2xl text-center bg-gradient-to-br from-purple-500/5 to-blue-600/5">
                            <span className="material-symbols-outlined text-6xl text-purple-500 mb-4 block">
                                domain
                            </span>
                            <h3 className="text-lg font-bold text-gh-text mb-2">
                                Unlock Enterprise Features
                            </h3>
                            <p className="text-gh-text-secondary mb-6 max-w-md mx-auto">
                                Get advanced security, compliance tools, premium support, and centralized
                                management for your organization.
                            </p>
                            <button
                                onClick={() => navigate("/enterprise/new")}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 mx-auto"
                            >
                                <span className="material-symbols-outlined">rocket_launch</span>
                                Create Enterprise
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                                    New
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {enterprises.map((enterprise) => (
                                <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default StrataHub;
