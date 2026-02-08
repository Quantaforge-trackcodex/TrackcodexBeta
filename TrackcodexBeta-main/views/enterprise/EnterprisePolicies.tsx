import React from 'react';

export default function EnterprisePolicies() {
    return (
        <div className="flex h-full min-h-screen bg-gh-bg text-gh-text-secondary">
            {/* Sidebar */}
            <div className="w-64 pr-8 hidden md:block border-r border-gh-border mr-8">
                <div className="mb-4">
                    <h3 className="px-2 text-xs font-semibold text-gh-text mb-2">Policies</h3>

                    {/* Repository Section */}
                    <div className="mb-2">
                        <button className="flex items-center justify-between w-full px-2 py-1.5 text-gh-text font-medium text-sm group">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">folder</span>
                                Repository
                            </div>
                            <span className="material-symbols-outlined text-[16px]">expand_less</span>
                        </button>
                        <nav className="pl-4 space-y-0.5 mt-1 border-l border-gh-border ml-4">
                            <a href="#" className="flex items-center justify-between px-2 py-1.5 bg-gh-bg-secondary text-gh-text rounded-md text-xs font-medium border-l-2 border-[#f78166] -ml-[17px]">
                                <span className="pl-3">Repository</span>
                                <span className="px-1.5 py-0.5 text-[10px] border border-gh-border rounded-full text-[#58a6ff] border-[#58a6ff]">Preview</span>
                            </a>
                            <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-xs transition-colors">
                                Code
                            </a>
                            <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-xs transition-colors">
                                Code insights
                            </a>
                            <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-xs transition-colors">
                                Code ruleset bypasses
                            </a>
                            <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-xs transition-colors">
                                Custom properties
                            </a>
                        </nav>
                    </div>

                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        Member privileges
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">dns</span>
                        Codespaces
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">play_circle</span>
                        Actions
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
                        Hosted compute networking
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                        Projects
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">security</span>
                        Advanced Security
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">key</span>
                        Personal access tokens
                    </a>
                    <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                        Sponsors
                    </a>
                    <a href="#" className="flex items-center justify-between px-2 py-1.5 text-gh-text-secondary hover:text-gh-text rounded-md text-sm transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">share</span>
                            Models
                        </div>
                        <span className="px-1.5 py-0.5 text-[10px] border border-gh-border rounded-full text-[#58a6ff] border-[#58a6ff]">Preview</span>
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gh-text mb-6">Repository policies</h2>

                <div className="flex gap-4 items-start">
                    <div className="mt-1">
                        <div className="w-8 h-8 rounded-full bg-gh-bg-secondary flex items-center justify-center text-gh-text-secondary">
                            <span className="material-symbols-outlined text-[18px]">alt_route</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gh-text mb-1">You haven't created any policies</h3>
                        <p className="text-sm text-gh-text-secondary mb-4">
                            Define whether members can perform operations on repositories such as delete and transfer. <a href="#" className="text-[#58a6ff] hover:underline">Learn more about rulesets.</a>
                        </p>

                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#1f6feb] border border-gh-border rounded-md hover:bg-[#388bfd] transition-colors">
                            New policy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
