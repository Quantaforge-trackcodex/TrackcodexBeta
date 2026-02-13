import React, { useState } from "react";
import PurchaseModal from "../../components/billing/PurchaseModal";

const BillingSettings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTimeframe, setSelectedTimeframe] = useState("current-month");

    const usageByProducts = [
        { name: "Actions", icon: "play_circle", billable: "$0", included: "0 min used / 2,000 min included" },
        { name: "Codespaces", icon: "laptop_mac", billable: "$0", included: "0 GB used / 0.5 GB included" },
        { name: "Copilot", icon: "psychology", billable: "$0", included: "Included" },
        { name: "Git LFS", icon: "storage", billable: "$0", included: "0 GB used / 1 GB included" },
        { name: "Models", icon: "model_training", billable: "$0", included: "Included" },
        { name: "Packages", icon: "inventory_2", billable: "$0", included: "0 GB used / 0.5 GB included" },
        { name: "Spark", icon: "auto_awesome", billable: "$0", included: "Included" },
    ];

    const usageByRepository = [
        { name: "TrackcodexBeta", color: "bg-emerald-500", amount: "$0.03" },
        { name: "mits-college", color: "bg-blue-500", amount: "$0.02" },
        { name: "Gitea", color: "bg-purple-500", amount: "$0.01" },
        { name: "trackcodexbeta", color: "bg-red-500", amount: "<$0.01" },
        { name: "trackcodexVersion1.0.0", color: "bg-orange-500", amount: "<$0.01" },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <header>
                <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
                    Overview
                </h1>
            </header>

            {/* Current Usage Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5">
                    <h3 className="text-sm font-bold text-gh-text mb-3">Current metered usage</h3>
                    <p className="text-3xl font-black text-gh-text mb-2">$0.08</p>
                    <p className="text-xs text-gh-text-secondary">
                        Gross metered usage for February 1 - February 27, 2026.
                    </p>
                </div>

                <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gh-text">Current included usage</h3>
                        <button className="text-primary text-xs font-bold hover:underline">
                            More details
                        </button>
                    </div>
                    <p className="text-3xl font-black text-gh-text mb-2">$0.08</p>
                    <p className="text-xs text-gh-text-secondary">
                        Included usage discounts for February 1 - February 27, 2026.
                    </p>
                </div>

                <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gh-text">Next payment due</h3>
                        <button className="text-primary text-xs font-bold hover:underline">
                            Payment history
                        </button>
                    </div>
                    <p className="text-3xl font-black text-gh-text mb-2">-</p>
                </div>
            </section>

            {/* Subscriptions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gh-text">Subscriptions</h2>
                    <button className="text-primary text-sm font-bold hover:underline">
                        Manage subscriptions
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gh-text mb-2">GitHub Free</h3>
                        <p className="text-2xl font-black text-gh-text">
                            $0.00 <span className="text-sm font-normal text-gh-text-secondary">per month</span>
                        </p>
                    </div>
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5">
                        <h3 className="text-sm font-bold text-gh-text mb-2">Copilot Free</h3>
                        <p className="text-2xl font-black text-gh-text">
                            $0.00 <span className="text-sm font-normal text-gh-text-secondary">per month</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Metered Usage */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gh-text">Metered usage</h2>
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        aria-label="Select timeframe for usage data"
                        className="px-3 py-1.5 bg-gh-bg-secondary border border-gh-border rounded-lg text-sm text-gh-text"
                    >
                        <option value="current-month">Timeframe: Current month</option>
                        <option value="last-month">Timeframe: Last month</option>
                        <option value="last-3-months">Timeframe: Last 3 months</option>
                    </select>
                </div>

                {/* Usage by Products */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gh-text mb-4">Usage by products</h3>
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                        {/* Product Tabs */}
                        <div className="flex items-center gap-4 px-5 py-3 border-b border-gh-border overflow-x-auto">
                            {usageByProducts.map((product) => (
                                <button
                                    key={product.name}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gh-text-secondary hover:text-gh-text transition-colors whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined !text-[16px]">
                                        {product.icon}
                                    </span>
                                    {product.name}
                                </button>
                            ))}
                        </div>

                        {/* Usage Details */}
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-gh-text">Billable usage</h4>
                                        <button className="text-primary text-xs font-bold hover:underline">
                                            View details
                                        </button>
                                    </div>
                                    <p className="text-3xl font-black text-gh-text mb-2">$0</p>
                                    <p className="text-xs text-gh-text-secondary mb-4">
                                        <span className="font-bold">$0.04</span> consumed usage · <span className="font-bold">$0.04</span> discounts
                                    </p>
                                    <p className="text-xs text-gh-text-secondary">
                                        Billable spend for Actions and Actions Runners for the selected timeframe.
                                        Applicable discounts cover Actions usage in public repositories and included
                                        usage for Actions minutes and storage.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-gh-text">Included usage</h4>
                                        <button className="text-primary text-xs font-bold hover:underline">
                                            Manage budgets
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gh-text">Actions minutes</span>
                                                <span className="text-xs text-gh-text-secondary">0 min used / 2,000 min included</span>
                                            </div>
                                            <div className="h-1.5 bg-gh-bg rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-0"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gh-text">Actions storage</span>
                                                <span className="text-xs text-gh-text-secondary">0 GB used / 0.5 GB included</span>
                                            </div>
                                            <div className="h-1.5 bg-gh-bg rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-0"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gh-text-secondary mt-4">
                                        Included usage limits reset in 16 days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage by Repository */}
                <div>
                    <h3 className="text-lg font-bold text-gh-text mb-4">Usage by repository</h3>
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gh-text-secondary">Top five repositories this month</p>
                            <button className="text-gh-text-secondary hover:text-gh-text">
                                <span className="material-symbols-outlined !text-[20px]">more_horiz</span>
                            </button>
                        </div>

                        {/* Visual Bar */}
                        <div className="h-2 bg-gh-bg rounded-full overflow-hidden flex mb-4">
                            <div className="bg-emerald-500 w-[40%]"></div>
                            <div className="bg-blue-500 w-[30%]"></div>
                            <div className="bg-purple-500 w-[15%]"></div>
                            <div className="bg-red-500 w-[10%]"></div>
                            <div className="bg-orange-500 w-[5%]"></div>
                        </div>

                        {/* Repository List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-gh-text-secondary font-bold pb-2 border-b border-gh-border">
                                <span>Repository</span>
                                <span>Gross amount</span>
                            </div>
                            {usageByRepository.map((repo) => (
                                <div key={repo.name} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-2 rounded-full ${repo.color}`}></div>
                                        <span className="text-sm text-gh-text">{repo.name}</span>
                                    </div>
                                    <span className="text-sm text-gh-text font-mono">{repo.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default BillingSettings;
