import React from 'react';

interface SkillData {
    coding: number;
    quality: number;
    bugDetection: number;
    security: number;
    collaboration: number;
    architecture: number;
    consistency: number;
    communityImpact: number;
}

interface SkillBreakdownProps {
    data: SkillData;
}

const SkillBreakdown: React.FC<SkillBreakdownProps> = ({ data }) => {
    const metrics = [
        { label: 'Coding', value: data.coding, color: 'text-emerald-400', bar: 'bg-emerald-500' },
        { label: 'Quality', value: data.quality, color: 'text-blue-400', bar: 'bg-blue-500' },
        { label: 'Bug Detection', value: data.bugDetection, color: 'text-red-400', bar: 'bg-red-500' },
        { label: 'Security', value: data.security, color: 'text-orange-400', bar: 'bg-orange-500' },
        { label: 'Collaboration', value: data.collaboration, color: 'text-purple-400', bar: 'bg-purple-500' },
        { label: 'Architecture', value: data.architecture, color: 'text-indigo-400', bar: 'bg-indigo-500' },
        { label: 'Consistency', value: data.consistency, color: 'text-yellow-400', bar: 'bg-yellow-500' },
        { label: 'Community', value: data.communityImpact, color: 'text-pink-400', bar: 'bg-pink-500' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {metrics.map((metric) => (
                <div key={metric.label} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">{metric.label}</span>
                        <span className={`text-xl font-mono font-bold ${metric.color}`}>{Math.round(metric.value)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${metric.bar}`}
                            style={{ width: `${Math.min(metric.value, 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkillBreakdown;
