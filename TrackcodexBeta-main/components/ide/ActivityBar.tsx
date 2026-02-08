
import React from 'react';

interface ActivityBarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, setActiveView }) => {
    const tools = [
        { id: 'explorer', icon: 'files' },
        { id: 'search', icon: 'search' },
        { id: 'git', icon: 'account_tree' },
        { id: 'debug', icon: 'bug_report' },
        { id: 'extensions', icon: 'extension' },
    ];

    return (
        <div className="w-[48px] bg-[#333333] flex flex-col items-center py-2 shrink-0 border-r border-[#2b2b2b] z-20">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => setActiveView(activeView === tool.id ? '' : tool.id)}
                    className={`w-[48px] h-[48px] flex items-center justify-center mb-1 relative group ${activeView === tool.id ? 'text-white' : 'text-[#858585] hover:text-white'}`}
                >
                    {activeView === tool.id && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"></div>}
                    <span className="material-symbols-outlined !text-[24px] font-light">{tool.icon}</span>
                </button>
            ))}
        </div>
    );
};

export default ActivityBar;
