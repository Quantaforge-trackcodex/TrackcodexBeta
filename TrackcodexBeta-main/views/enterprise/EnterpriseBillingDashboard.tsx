import React, { useState } from 'react';

export default function EnterpriseBillingDashboard() {
    const [activeTab, setActiveTab] = useState('actions');

    return (
        <div className="flex h-full min-h-screen bg-gh-bg text-gh-text">
            {/* Sidebar */}
            <div className="w-64 pr-8 hidden md:block border-r border-gh-border mr-8">
                <div className="mb-4">
                    <h3 className="px-2 text-xs font-semibold text-gh-text mb-2">Billing and licensing</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 bg-gh-bg-tertiary text-gh-text rounded-md text-sm font-semibold border-l-2 border-orange-500">
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Overview
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                            Usage
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px]">balance</span>
                            Licensing
                        </a>
                    </nav>
                </div>

                <div className="mb-4 border-t border-gh-border pt-4">
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        Cost centers
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">notifications</span>
                        Budgets and alerts
                    </a>
                </div>

                <div className="border-t border-gh-border pt-4">
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">credit_card</span>
                        Payment information
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        Payment history
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        Billing contacts
                    </a>
                </div>

                <div className="mt-4 border-t border-gh-border pt-4">
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">apps</span>
                        Marketplace apps
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        Sponsorships
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <h2 className="text-xl font-semibold text-gh-text mb-4">Overview</h2>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-gh-bg-secondary border border-gh-border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xs font-semibold text-gh-text">Current metered usage</h3>
                            <a href="#" className="text-xs text-blue-400 hover:underline">More details</a>
                        </div>
                        <div className="text-2xl font-light text-gh-text mb-1">$0</div>
                        <p className="text-[11px] text-gh-text-secondary">Gross metered usage for February 1 - February 27, 2026.</p>
                    </div>

                    <div className="p-4 bg-gh-bg-secondary border border-gh-border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xs font-semibold text-gh-text">Current included usage</h3>
                            <a href="#" className="text-xs text-gh-text hover:underline">More details</a>
                        </div>
                        <div className="text-2xl font-light text-gh-text mb-1">$0</div>
                        <p className="text-[11px] text-gh-text-secondary">Included usage discounts for February 1 - February 27, 2026.</p>
                    </div>

                    <div className="p-4 bg-gh-bg-secondary border border-gh-border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xs font-semibold text-gh-text">Estimated next payment</h3>
                        </div>
                        <div className="text-2xl font-light text-gh-text mb-1">$0</div>
                        <p className="text-[11px] text-gh-text-secondary">Estimated next payment due for the February 1 - February 27, 2026 billing cycle.</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-gh-text">Metered usage</h2>
                    <button className="px-3 py-1.5 text-xs font-medium text-gh-text bg-gh-bg-secondary border border-gh-border rounded-md hover:bg-gh-bg-tertiary">
                        Timeframe: Current month <span className="text-[10px] ml-1">▼</span>
                    </button>
                </div>

                {/* Usage Section */}
                <div className="bg-gh-bg-secondary border border-gh-border rounded-md overflow-hidden mb-8">
                    <div className="px-4 py-3 border-b border-gh-border">
                        <h3 className="text-xs font-semibold text-gh-text">Usage by products</h3>
                    </div>

                    {/* Tabs */}
                    <div className="px-4 pt-4 border-b border-gh-border">
                        <nav className="flex gap-4" aria-label="Tabs">
                            {[
                                { id: 'actions', name: 'Actions', icon: 'play_circle' },
                                { id: 'codespaces', name: 'Codespaces', icon: 'dns' },
                                { id: 'security', name: 'Advanced Security', icon: 'security' },
                                { id: 'enterprise', name: 'Enterprise', icon: 'business' },
                                { id: 'lfs', name: 'Git LFS', icon: 'storage' },
                                { id: 'models', name: 'Models', icon: 'share' },
                                { id: 'packages', name: 'Packages', icon: 'inventory_2' },
                                { id: 'spark', name: 'Spark', icon: 'bolt' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-3 border-b-2 text-xs font-medium flex items-center gap-2 transition-colors ${activeTab === tab.id
                                        ? "border-orange-500 text-gh-text"
                                        : "border-transparent text-gh-text-secondary hover:text-gh-text hover:border-gh-text-secondary"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-semibold text-gh-text">Billable usage</h4>
                                <a href="#" className="text-xs text-blue-400 hover:underline">View details</a>
                            </div>
                            <div className="text-3xl font-light text-gh-text mb-1">$0</div>
                            <div className="text-xs text-gh-text-secondary mb-2">$0 consumed usage - $0 discounts</div>
                            <p className="text-[11px] text-gh-text-secondary leading-normal">
                                Billable spend for Actions and Actions Runners for the selected timeframe. Applicable discounts cover Actions usage in public repositories and included usage for Actions minutes and storage.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-semibold text-gh-text">Included usage</h4>
                                <a href="#" className="text-xs text-blue-400 hover:underline">Manage budgets</a>
                            </div>

                            {/* Progress Bars */}
                            <div>
                                <div className="flex justify-between text-[11px] text-gh-text mb-1">
                                    <span>Actions minutes</span>
                                    <span className="text-gh-text-secondary">0 min used / 3,000 min included</span>
                                </div>
                                <div className="w-full bg-gh-border rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full w-0"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-[11px] text-gh-text mb-1">
                                    <span>Actions storage</span>
                                    <span className="text-gh-text-secondary">0 GB used / 50 GB included</span>
                                </div>
                                <div className="w-full bg-gh-border rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full w-0"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-[11px] text-gh-text mb-1">
                                    <span>Actions custom image storage</span>
                                    <span className="text-gh-text-secondary">0 GiB used / 150 GiB included</span>
                                </div>
                                <div className="w-full bg-gh-border rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full w-0"></div>
                                </div>
                            </div>

                            <p className="text-[11px] text-gh-text-secondary mt-2">Included usage limits reset in 21 days.</p>
                        </div>
                    </div>
                </div>

                {/* Charts Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-md h-64 flex flex-col">
                        <div className="px-4 py-3 border-b border-gh-border flex justify-between items-center">
                            <h3 className="text-xs font-semibold text-gh-text">Usage by organization</h3>
                            <button className="text-gh-text-secondary hover:text-gh-text">
                                <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-gh-text-secondary">
                            <span className="material-symbols-outlined text-3xl mb-2">warning</span>
                            <span className="text-sm font-semibold text-gh-text">No usage found</span>
                        </div>
                    </div>

                    <div className="bg-gh-bg-secondary border border-gh-border rounded-md h-64 flex flex-col">
                        <div className="px-4 py-3 border-b border-gh-border flex justify-between items-center">
                            <h3 className="text-xs font-semibold text-gh-text">Usage by repository</h3>
                            <button className="text-gh-text-secondary hover:text-gh-text">
                                <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-gh-text-secondary">
                            <span className="material-symbols-outlined text-3xl mb-2">warning</span>
                            <span className="text-sm font-semibold text-gh-text">No usage found</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
