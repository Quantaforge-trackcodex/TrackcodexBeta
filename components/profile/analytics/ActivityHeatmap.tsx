import React, { useMemo } from 'react';

interface Contribution {
    date: string;
    count: number;
    level: number;
}

interface ActivityHeatmapProps {
    contributions: Contribution[];
    total: number;
    from: string;
    to: string;
}

const LEVEL_COLORS = [
    'bg-[#161b22]', // Level 0 (GitHub dark dim)
    'bg-[#0e4429]', // Level 1
    'bg-[#006d32]', // Level 2
    'bg-[#26a641]', // Level 3
    'bg-[#39d353]', // Level 4
];

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ contributions = [], total }) => {

    // Transform flat list into Weeks x Days matrix
    const matrix = useMemo(() => {
        const dataMap: Record<string, Contribution> = {};
        contributions.forEach(c => dataMap[c.date] = c);

        const weeks = [];
        // Start from one year ago (aligned to Sunday/Monday?)
        // GitHub usually shows exactly 52-53 weeks ending today

        // We will generate the grid ending "today" (or the provided 'to' date)
        // and work backwards for 365 days.

        // However, for pure grid rendering, it's easier to iterate columns (weeks) 
        // and rows (days 0-6).

        const today = new Date();
        // Align to Saturday (end of week) to fill the grid right-to-left or start-to-end
        // Simpler: iterate 365 days, fill array, then slice into chunks of 7

        // Wait, GitHub is Column-Major (Week 1: Sun-Sat, Week 2: Sun-Sat)

        // Generate dates for last 365 days
        const allDates = [];
        for (let i = 365; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            allDates.push(d.toISOString().split('T')[0]);
        }

        // We need to pad the beginning so the first column starts on the correct day index
        const firstDate = new Date(allDates[0]);
        const startDay = firstDate.getDay(); // 0 = Sunday

        // Pad with nulls
        const paddedDates = Array(startDay).fill(null).concat(allDates);

        const grid = [];
        while (paddedDates.length > 0) {
            grid.push(paddedDates.splice(0, 7));
        }

        return grid; // Array of Weeks, each week is Array of 7 days (or null)
    }, [contributions]);

    const getLevelColor = (date: string | null) => {
        if (!date) return 'bg-transparent';
        const item = contributions.find(c => c.date === date);
        const level = item ? item.level : 0;
        return LEVEL_COLORS[level] || LEVEL_COLORS[0];
    };

    const getTooltip = (date: string | null) => {
        if (!date) return '';
        const item = contributions.find(c => c.date === date);
        const count = item ? item.count : 0;
        return `${count} contributions on ${date}`;
    };

    return (
        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-md font-sans text-[#c9d1d9] w-full overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs">
                    {total.toLocaleString()} contributions in the last year
                </span>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="flex gap-[3px]">
                    {/* Column Major Grid */}
                    {matrix.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[3px]">
                            {week.map((date, dIndex) => (
                                <div
                                    key={`${wIndex}-${dIndex}`}
                                    className={`w-[10px] h-[10px] rounded-[2px] ${getLevelColor(date)} ring-0 hover:ring-1 hover:ring-[#8b949e]/50 transition-none cursor-pointer`}
                                    title={getTooltip(date)}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#7d8590] mt-2">
                <span>Learn how we count contributions</span>
                <div className="flex items-center gap-1">
                    <span>Less</span>
                    {LEVEL_COLORS.map((color, i) => (
                        <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${color}`}></div>
                    ))}
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};
