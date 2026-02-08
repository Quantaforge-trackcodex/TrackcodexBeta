import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface AIUsageChartProps {
    logs: any[];
    totalTokens: number;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export const AIUsageChart: React.FC<AIUsageChartProps> = ({ logs, totalTokens }) => {

    // Aggregate by Action Type
    const data = React.useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            counts[log.actionType] = (counts[log.actionType] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [logs]);

    // Mock Trend Data (since we might not have enough history seeded)
    const trendData = [
        { name: 'Mon', usage: 400 },
        { name: 'Tue', usage: 1200 },
        { name: 'Wed', usage: 800 },
        { name: 'Thu', usage: 2400 },
        { name: 'Fri', usage: 1800 },
        { name: 'Sat', usage: 200 },
        { name: 'Sun', usage: 900 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Distribution */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                    <span className="text-purple-400">🤖</span> AI Forge Usage
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                                itemStyle={{ color: '#e4e4e7' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 block">Total Tokens Used</span>
                </div>
            </div>

            {/* Usage Trend */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-4">
                    <span className="text-blue-400">📈</span> Weekly Token Consumption
                </h3>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData}>
                            <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#27272a' }}
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                            />
                            <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
