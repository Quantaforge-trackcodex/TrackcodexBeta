import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export const CandidateCard = ({ application, onClick }: { application: any; onClick?: () => void }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: application.id,
        data: { application }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm hover:border-primary/50 cursor-grab active:cursor-grabbing mb-3"
        >
            <div className="flex items-center gap-3 mb-3">
                <img src={application.applicant.avatar} className="size-8 rounded-lg bg-[#0d1117] object-cover" />
                <div>
                    <p className="text-xs font-bold text-white">{application.applicant.name}</p>
                    <p className="text-[10px] text-slate-500">@{application.applicant.username}</p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">match: <span className="text-emerald-400 font-bold">{application.score || 'N/A'}%</span></span>
                <span className="text-[10px] text-primary hover:underline cursor-pointer">View</span>
            </div>
        </div>
    );
};
