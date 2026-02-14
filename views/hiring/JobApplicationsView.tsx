import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KanbanBoard from '../../components/applications/KanbanBoard';

const JobApplicationsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-gh-bg overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-gh-border flex items-center justify-between px-6 shrink-0 bg-gh-bg-secondary">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gh-text-secondary hover:text-gh-text transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-gh-text tracking-tight">Backend Engineer (Python/Rust)</h1>
                        <p className="text-[10px] text-gh-text-secondary font-mono">ID: {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 border border-gh-border rounded-md text-[11px] font-bold text-gh-text-secondary hover:bg-gh-bg-secondary">
                        Export CSV
                    </button>
                    <button className="px-3 py-1.5 bg-primary text-white rounded-md text-[11px] font-bold">
                        Invite Candidate
                    </button>
                </div>
            </div>

            {/* Board */}
            <div className="flex-1 p-6 overflow-hidden">
                {id ? <KanbanBoard jobId={id} /> : <div>Invalid Job ID</div>}
            </div>
        </div>
    );
};

export default JobApplicationsView;
