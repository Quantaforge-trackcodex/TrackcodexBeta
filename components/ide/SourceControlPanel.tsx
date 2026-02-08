import React, { useState, useEffect } from 'react';

interface Integration {
    id: string;
    name: string;
    connected: boolean;
}

const SourceControlPanel = () => {
    const [message, setMessage] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isConnected, setIsConnected] = useState(true); // Default to true, sync with auth later
    const [lastSync, setLastSync] = useState<string>('Now');

    // Simulate reading the real integration state
    useEffect(() => {
        const checkAuth = () => {
            const saved = localStorage.getItem('trackcodex_integrations');
            if (saved) {
                const integr: Integration[] = JSON.parse(saved);
                const github = integr.find(i => i.id === 'github');
                if (github) setIsConnected(github.connected);
            }
        };
        checkAuth();
        // Listen for changes
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const changes = [
        { file: 'src/components/ide/TerminalPanel.tsx', status: 'M', name: 'TerminalPanel.tsx', path: 'src/components/ide' },
        { file: 'src/types.ts', status: 'M', name: 'types.ts', path: 'src' },
        { file: 'src/views/RepoDetail.tsx', status: 'D', name: 'RepoDetail.tsx', path: 'src/views' },
        { file: 'README.md', status: 'U', name: 'README.md', path: '' },
    ];

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setLastSync('Now');
            const event = new CustomEvent('trackcodex-notification', {
                detail: { title: 'Git Sync', message: 'Successfully pulled 2 commits and pushed 1 commit.', type: 'success' }
            });
            window.dispatchEvent(event);
        }, 2000);
    };

    const handleCommit = () => {
        if (!message) return;
        setMessage('');
        const event = new CustomEvent('trackcodex-notification', {
            detail: { title: 'Commit Created', message: `Committed changes to 'main': ${message}`, type: 'success' }
        });
        window.dispatchEvent(event);
    }

    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#252526] text-[#cccccc] font-sans">
                <div className="mb-4 text-slate-500">
                    <span className="material-symbols-outlined !text-[48px]">source_branch</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">No Source Control</h3>
                <p className="text-xs text-[#969696] mb-6 leading-relaxed">
                    Connect your GitHub account to clone repositories and sync changes.
                </p>
                <button
                    onClick={() => window.location.hash = '/settings/integrations'}
                    className="bg-[#007fd4] hover:bg-[#006ab1] text-white text-xs px-4 py-2 rounded-sm font-medium transition-colors"
                >
                    Connect GitHub
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#252526] text-[#cccccc] font-sans">
            <div className="px-5 py-2 text-[11px] text-[#bbbbbb] flex items-center justify-between font-bold">
                <span className="tracking-wide uppercase">SOURCE CONTROL</span>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white" title="View as Tree">view_headline</span>
                    <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white" title="More Actions...">more_horiz</span>
                </div>
            </div>

            {/* Sync / Branch Action Bar */}
            <div className="px-3 pb-3 border-b border-[#30363d]/50">
                <div className="flex items-center justify-between mb-3 bg-[#1e1e1e] rounded-sm p-1.5 border border-[#3c3c3c]">
                    <div className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer hover:text-[#007fd4]">
                        <span className="material-symbols-outlined !text-[14px]">source_branch</span>
                        main*
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold">
                        <span className="flex items-center gap-0.5 text-[#cccccc]" title="Commits to Pull">
                            <span className="material-symbols-outlined !text-[12px]">arrow_downward</span> 0
                        </span>
                        <span className="flex items-center gap-0.5 text-[#cccccc]" title="Commits to Push">
                            <span className="material-symbols-outlined !text-[12px]">arrow_upward</span> 1
                        </span>
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`flex items-center gap-1 hover:text-white ${isSyncing ? 'text-[#007fd4] animate-pulse' : 'text-[#cccccc]'}`}
                            title="Sync Changes (Pull & Push)"
                        >
                            <span className={`material-symbols-outlined !text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') handleCommit(); }}
                        placeholder="Message (Ctrl+Enter to commit)"
                        className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007fd4] text-white text-[13px] px-2 py-1.5 outline-none placeholder-[#969696] min-h-[70px] resize-none font-sans rounded-sm custom-scrollbar"
                    />
                    <button
                        onClick={handleCommit}
                        className="bg-[#007fd4] hover:bg-[#006ab1] text-white text-[13px] py-1.5 rounded-sm flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined !text-[16px]">check</span>
                        Commit
                    </button>
                </div>
            </div>

            {/* Changes List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between px-3 py-1 bg-[#2a2d2e]/50 hover:bg-[#2a2d2e] cursor-pointer group mt-2">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">expand_more</span>
                            <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide">Changes</span>
                            <span className="bg-[#454545] text-white text-[10px] px-1.5 rounded-full ml-1">{changes.length}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white" title="Discard All Changes">replay</span>
                            <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white" title="Stage All Changes">add</span>
                        </div>
                    </div>

                    <div className="mt-0.5">
                        {changes.map((change, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-5 py-1 hover:bg-[#2a2d2e] cursor-pointer group text-[13px]">
                                <span className={`text-[12px] font-bold w-3 text-center ${change.status === 'M' ? 'text-amber-400' :
                                    change.status === 'D' ? 'text-red-400' :
                                        change.status === 'U' ? 'text-green-400' : 'text-slate-400'
                                    }`}>{change.status}</span>
                                <div className="flex-1 truncate flex items-center gap-1.5">
                                    <span className="text-[#cccccc]">{change.name}</span>
                                    <span className="text-[#888888] text-[11px] truncate">{change.path}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white" title="Discard Changes">undo</span>
                                    <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white" title="Stage Changes">add</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceControlPanel;
