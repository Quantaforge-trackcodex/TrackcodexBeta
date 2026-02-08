import React from 'react';
import { Link } from 'react-router-dom';

export default function EnterpriseOrganizations() {
    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 pr-8 hidden md:block">
                <nav className="space-y-1">
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 bg-gh-bg-tertiary text-gh-text rounded-md text-sm font-semibold border-l-2 border-orange-500">
                        <span className="material-symbols-outlined text-[18px]">home</span>
                        Overview
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">list_alt</span>
                        Custom Properties
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gh-text">Overview</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gh-text bg-gh-bg-secondary border border-gh-border rounded-md hover:bg-gh-bg-tertiary hover:border-gh-text-secondary transition-colors">
                            Invite organization
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#238636] border border-[rgba(240,246,252,0.1)] rounded-md hover:bg-[#2eaa3a] transition-colors">
                            New organization
                        </button>
                    </div>
                </div>

                <div className="bg-gh-bg border border-gh-border rounded-md overflow-hidden">
                    <div className="p-4 border-b border-gh-border bg-gh-bg-secondary flex items-center gap-4">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-2 top-2 text-gh-text-secondary text-[18px]">search</span>
                            <input
                                type="text"
                                placeholder="Find an organization..."
                                className="w-full pl-8 pr-3 py-1.5 bg-gh-bg border border-gh-border rounded-md text-gh-text text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder-gh-text-secondary"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium text-gh-text bg-gh-bg-secondary border border-gh-border rounded-md hover:bg-gh-bg-tertiary">
                                Two-factor authentication <span className="text-[10px] ml-1">▼</span>
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d]">
                                Deploy keys <span className="text-[10px] ml-1">▼</span>
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d]">
                                Your role <span className="text-[10px] ml-1">▼</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gh-bg-secondary px-4 py-2 border-b border-gh-border flex text-xs font-semibold text-gh-text-secondary">
                        <div className="w-1/2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">domain</span>
                            1 organization
                        </div>
                        <div className="w-1/6">Two-factor authentication</div>
                        <div className="w-1/6">Members</div>
                        <div className="w-1/6">Repositories</div>
                        <div className="w-1/6">Deploy keys</div>
                    </div>

                    <ul>
                        <li className="flex items-center px-4 py-3 hover:bg-gh-bg-secondary transition-colors border-t border-gh-border first:border-t-0">
                            <div className="flex-1 flex items-center gap-3">
                                <img
                                    src="https://github.com/github.png"
                                    alt="quantaforge"
                                    className="w-5 h-5 rounded-md"
                                />
                                <div className="flex items-center gap-2">
                                    <Link to="/org/quantaforge" className="text-blue-400 hover:underline font-semibold text-sm">
                                        quantaforge
                                    </Link>
                                    <span className="px-1.5 py-0.5 text-[10px] border border-gh-border rounded-full text-gh-text-secondary bg-gh-bg-secondary">Owner</span>
                                </div>
                            </div>
                            <div className="w-1/6 text-xs text-gh-text-secondary"></div>
                            <div className="w-1/6 flex items-center gap-1 text-xs text-gh-text-secondary">
                                <span className="material-symbols-outlined text-[14px]">person</span>
                                8
                            </div>
                            <div className="w-1/6 flex items-center gap-1 text-xs text-gh-text-secondary">
                                <span className="material-symbols-outlined text-[14px]">folder</span>
                                1
                            </div>
                            <div className="w-1/6 text-xs text-gh-text-secondary"></div>
                            <button className="text-gh-text-secondary hover:text-gh-text">
                                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
