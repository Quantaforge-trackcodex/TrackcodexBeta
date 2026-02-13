import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

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

interface SkillRadarChartProps {
    data: SkillData;
    platformAverage?: SkillData; // Optional comparison
    loading?: boolean;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data, platformAverage, loading }) => {
    // Transform data for Recharts
    const chartData = [
        { subject: 'Coding', A: data.coding, B: platformAverage?.coding || 50, fullMark: 100 },
        { subject: 'Quality', A: data.quality, B: platformAverage?.quality || 50, fullMark: 100 },
        { subject: 'Bug Detect', A: data.bugDetection, B: platformAverage?.bugDetection || 20, fullMark: 100 },
        { subject: 'Security', A: data.security, B: platformAverage?.security || 10, fullMark: 100 },
        { subject: 'Collab', A: data.collaboration, B: platformAverage?.collaboration || 60, fullMark: 100 },
        { subject: 'Arch', A: data.architecture, B: platformAverage?.architecture || 30, fullMark: 100 },
        { subject: 'Consistency', A: data.consistency, B: platformAverage?.consistency || 40, fullMark: 100 },
        { subject: 'Community', A: data.communityImpact, B: platformAverage?.communityImpact || 20, fullMark: 100 },
    ];

    if (loading) {
        return <div className="h-[400px] flex items-center justify-center text-slate-500">Loading Radar...</div>;
    }

    return (
        <div className="w-full h-[400px] bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 relative">
            <h3 className="absolute top-4 left-4 text-sm font-bold text-slate-300 uppercase tracking-wider">Skill Radar</h3>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                    {/* User Score */}
                    <Radar
                        name="Your Skill"
                        dataKey="A"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="#10b981"
                        fillOpacity={0.3}
                    />

                    {/* Platform Average (Optional) */}
                    {platformAverage && (
                        <Radar
                            name="Global Avg"
                            dataKey="B"
                            stroke="#64748b"
                            strokeWidth={1}
                            fill="#64748b"
                            fillOpacity={0.1}
                            strokeDasharray="4 4"
                        />
                    )}

                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            <div className="absolute bottom-4 right-4 flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500/30 border border-emerald-500 rounded-full"></span>
                    <span className="text-slate-300">You</span>
                </div>
                {platformAverage && (
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-slate-500/30 border border-slate-500 border-dashed rounded-full"></span>
                        <span className="text-slate-400">Platform Avg</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillRadarChart;
