import React from 'react';

export default function EnterprisePeople() {
    return (
        <div className="flex h-full min-h-screen bg-gh-bg text-gh-text">
            {/* Sidebar */}
            <div className="w-64 pr-8 hidden md:block border-r border-gh-border mr-8">
                <div className="mb-4">
                    <h3 className="px-2 text-xs font-semibold text-gh-text mb-2">People</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 bg-gh-bg-tertiary text-gh-text rounded-md text-sm font-semibold border-l-2 border-orange-500">
                            <span className="material-symbols-outlined text-[18px]">group</span>
                            Members
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                            Administrators
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px]">groups</span>
                            Enterprise teams
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px]">public</span>
                            Outside collaborators
                        </a>
                    </nav>
                </div>

                <div className="mb-4 border-t border-gh-border pt-4">
                    <button className="flex items-center justify-between w-full px-2 py-1.5 text-gh-text-secondary hover:text-gh-text text-sm group">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">shield</span>
                            Enterprise roles
                        </div>
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </button>
                    <button className="flex items-center justify-between w-full px-2 py-1.5 text-gh-text-secondary hover:text-gh-text text-sm group">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">badge</span>
                            Organization roles
                        </div>
                    </button>
                </div>

                <div className="border-t border-gh-border pt-4">
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                        Invitations
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">report</span>
                        Failed invitations
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gh-text">Members</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gh-text bg-gh-bg-secondary border border-gh-border rounded-md hover:bg-gh-bg-tertiary transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            CSV report
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#1f6feb] border border-[rgba(240,246,252,0.1)] rounded-md hover:bg-[#388bfd] transition-colors">
                            Invite member
                        </button>
                    </div>
                </div>

                {/* Alert */}
                <div className="mb-6 p-4 border border-[rgba(56,139,253,0.4)] bg-[rgba(56,139,253,0.1)] rounded-md flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-400 mt-0.5">info</span>
                    <div className="flex-1">
                        <p className="text-sm text-gh-text">
                            You are the only owner of this enterprise! We recommend a minimum of two people within each enterprise have the owner role.
                        </p>
                    </div>
                    <button className="text-gh-text-secondary hover:text-gh-text" aria-label="Dismiss alert">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Roles Card */}
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-md overflow-hidden">
                        <div className="px-4 py-3 border-b border-gh-border flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gh-text">Roles</h3>
                            <span className="material-symbols-outlined text-gh-text-secondary text-[16px]">help</span>
                        </div>
                        <div className="p-0">
                            {[
                                { name: "Organization members", count: 0 },
                                { name: "Organization owners", count: 1 },
                                { name: "Enterprise owners", count: 1 },
                                { name: "Billing managers", count: 0 },
                                { name: "Unaffiliated", count: 0 },
                                { name: "Outside collaborators", count: 0, isLink: true }
                            ].map((role, idx) => (
                                <div key={role.name} className="flex justify-between items-center px-4 py-2 border-b border-gh-border last:border-b-0 text-sm text-gh-text">
                                    <div className="flex items-center gap-1">
                                        <span>{role.name}</span>
                                        {role.isLink && <span className="material-symbols-outlined text-[14px] text-gh-text-secondary">chevron_right</span>}
                                    </div>
                                    <span>{role.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Licenses Card */}
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-md overflow-hidden h-fit">
                        <div className="px-4 py-3 border-b border-gh-border flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gh-text">User licenses consumed</h3>
                            <span className="material-symbols-outlined text-gh-text-secondary text-[16px]">help</span>
                        </div>
                        <div className="p-0">
                            <div className="flex justify-between items-center px-4 py-2 border-b border-gh-border text-sm text-gh-text">
                                <span>By users</span>
                                <span>1</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-2 text-sm text-gh-text">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gh-text-secondary text-[16px]">pie_chart</span>
                                    Total consumed
                                </div>
                                <span>0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-2 top-2 text-gh-text-secondary text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Find a member..."
                            className="w-full pl-8 pr-3 py-1.5 bg-gh-bg border border-gh-border rounded-md text-gh-text text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder-gh-text-secondary"
                        />
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium text-gh-text bg-gh-bg-secondary border border-gh-border rounded-md hover:bg-gh-bg-tertiary">
                        Role <span className="text-[10px] ml-1">▼</span>
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d]">
                        Organization <span className="text-[10px] ml-1">▼</span>
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d]">
                        Two-factor authentication <span className="text-[10px] ml-1">▼</span>
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d]">
                        Cost center <span className="text-[10px] ml-1">▼</span>
                    </button>
                </div>

                {/* Member List */}
                <div className="bg-gh-bg border border-gh-border rounded-md overflow-hidden">
                    <div className="bg-gh-bg-secondary px-4 py-2 border-b border-gh-border flex justify-between items-center text-xs text-gh-text-secondary">
                        <span>1 person in quantaforge</span>
                        <span className="flex items-center gap-1 cursor-pointer hover:text-blue-400">Sort <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span></span>
                    </div>

                    <div className="flex items-center px-4 py-3 hover:bg-gh-bg-secondary transition-colors border-t border-gh-border first:border-t-0">
                        <div className="mr-4">
                            <input type="checkbox" className="rounded border-gray-600 bg-gh-bg text-blue-500 focus:ring-0 focus:ring-offset-0" aria-label="Select member" />
                        </div>
                        <img
                            src="https://github.com/github.png"
                            alt="Trackcodex"
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-blue-400 hover:underline cursor-pointer">Trackcodex</span>
                            </div>
                            <div className="text-xs text-gh-text-secondary">Quantaforge-trackcodex</div>
                        </div>

                        <div className="flex items-center gap-6 text-gh-text-secondary text-xs">
                            <div className="flex items-center gap-1" title="1 organization owner">
                                <span className="material-symbols-outlined text-[16px]">business</span>
                                1
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                                2FA
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">copyright</span>
                                License
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                                Cost center
                            </div>
                            <button className="hover:text-gh-text" aria-label="More options">
                                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
