import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KanbanBoard from '../../components/applications/KanbanBoard';

const JobApplicationsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-[#0d1117] overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-[#30363d] flex items-center justify-between px-6 shrink-0 bg-[#161b22]">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-tight">Backend Engineer (Python/Rust)</h1>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 border border-[#30363d] rounded-md text-[11px] font-bold text-slate-300 hover:bg-[#21262d]">
                        Export CSV
                    </button>
                    <button className="px-3 py-1.5 bg-primary text-white rounded-md text-[11px] font-bold">
                        Invite Candidate
                    </button>
                </div>
            </div>

            {/* Board */}
            <div className="flex-1 p-6 overflow-hidden">
                <KanbanBoard jobId={id} />
            </div>
        </div>
    );
};

export default JobApplicationsView;
