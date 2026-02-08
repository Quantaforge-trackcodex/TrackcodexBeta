import React, { useState } from 'react';

const RunAndDebugPanel = () => {
    const [configs, setConfigs] = useState(['Run Current File', 'Debug (pudb)', 'Attach to Process']);
    const [selectedConfig, setSelectedConfig] = useState('Run Current File');

    return (
        <div className="w-full h-full flex flex-col bg-[#252526] text-[#cccccc] font-sans">
            <div className="px-5 py-2 text-[11px] text-[#bbbbbb] flex items-center justify-between font-bold">
                <span className="tracking-wide uppercase">RUN AND DEBUG</span>
                <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white">more_horiz</span>
            </div>

            <div className="px-3 pb-3 border-b border-[#30363d]">
                <div className="flex items-center gap-1 bg-[#3c3c3c] p-1 rounded-sm border border-[#3c3c3c] hover:border-[#555]">
                    <button className="bg-[#388a34] hover:bg-[#44a03f] text-white p-0.5 rounded-sm flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined !text-[18px]">play_arrow</span>
                    </button>
                    <select
                        value={selectedConfig}
                        onChange={(e) => setSelectedConfig(e.target.value)}
                        className="bg-transparent border-none text-[12px] text-white outline-none flex-1 font-sans cursor-pointer"
                    >
                        {configs.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="hover:bg-[#454545] p-0.5 rounded text-[#cccccc]">
                        <span className="material-symbols-outlined !text-[16px]">settings</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* VARIABLES Section */}
                <div className="flex flex-col border-b border-[#30363d]">
                    <div className="flex items-center px-1 py-0.5 bg-[#2a2d2e] cursor-pointer group">
                        <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">expand_more</span>
                        <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide">Variables</span>
                    </div>
                    <div className="flex flex-col font-mono text-[12px] pl-2">
                        <div className="flex items-center px-4 py-0.5 hover:bg-[#2a2d2e] cursor-pointer group">
                            <span className="text-[#9cdcfe]">local_var</span>: <span className="text-[#b5cea8] ml-1">42</span>
                        </div>
                        <div className="flex items-center px-4 py-0.5 hover:bg-[#2a2d2e] cursor-pointer group">
                            <span className="text-[#9cdcfe]">text_buffer</span>: <span className="text-[#ce9178] ml-1">"init"</span>
                        </div>
                    </div>
                </div>

                {/* WATCH Section */}
                <div className="flex flex-col border-b border-[#30363d]">
                    <div className="flex items-center px-1 py-0.5 bg-[#2a2d2e] cursor-pointer group justify-between pr-2">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">expand_more</span>
                            <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide">Watch</span>
                        </div>
                        <span className="material-symbols-outlined !text-[14px] invisible group-hover:visible cursor-pointer hover:text-white">add</span>
                    </div>
                    <div className="p-4 text-xs italic opacity-50 text-center">No expressions watched</div>
                </div>

                {/* CALL STACK Section */}
                <div className="flex flex-col border-b border-[#30363d]">
                    <div className="flex items-center px-1 py-0.5 bg-[#2a2d2e] cursor-pointer group justify-between pr-2">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">expand_more</span>
                            <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide">Call Stack</span>
                        </div>
                        <div className="flex items-center gap-1 invisible group-hover:visible">
                            <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white">check_circle</span>
                            <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white">delete</span>
                        </div>
                    </div>
                    <div className="flex flex-col font-mono text-[12px] pl-2 text-[#888888] select-none pointer-events-none">
                        <div className="px-4 py-0.5">Not running</div>
                    </div>
                </div>

                {/* BREAKPOINTS Section */}
                <div className="flex flex-col border-b border-[#30363d]">
                    <div className="flex items-center px-1 py-0.5 bg-[#2a2d2e] cursor-pointer group justify-between pr-2">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined !text-[16px] text-[#cccccc]">expand_more</span>
                            <span className="text-[11px] font-bold text-[#cccccc] uppercase tracking-wide">Breakpoints</span>
                        </div>
                        <div className="flex items-center gap-1 invisible group-hover:visible">
                            <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white">add</span>
                            <span className="material-symbols-outlined !text-[14px] cursor-pointer hover:text-white">delete_sweep</span>
                        </div>
                    </div>
                    <div className="flex flex-col font-mono text-[12px] pl-2">
                        <div className="flex items-center px-4 py-0.5 hover:bg-[#2a2d2e] cursor-pointer group gap-2">
                            <div className="size-2 bg-red-500 rounded-full"></div>
                            <span className="text-[#cccccc]">main.cpp</span>
                            <span className="text-[#888888] ml-auto">14</span>
                        </div>
                        <div className="flex items-center px-4 py-0.5 hover:bg-[#2a2d2e] cursor-pointer group gap-2">
                            <div className="size-2 bg-transparent border border-red-500 rounded-full"></div>
                            <span className="text-[#cccccc] opacity-70">utils.ts</span>
                            <span className="text-[#888888] ml-auto">8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RunAndDebugPanel;
