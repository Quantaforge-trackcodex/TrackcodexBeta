import React, { useState } from "react";

const BillingUsage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [groupBy, setGroupBy] = useState("none");
    const [timeframe, setTimeframe] = useState("current-month");

    // Mock usage data for the chart
    const usageData = [
        { date: "Feb 1", usage: 0 },
        { date: "Feb 2", usage: 0 },
        { date: "Feb 3", usage: 0 },
        { date: "Feb 4", usage: 0 },
        { date: "Feb 5", usage: 0 },
        { date: "Feb 6", usage: 0.04, gross: 0.00, billed: 0.00, discount: 0.00 },
        { date: "Feb 7", usage: 0 },
        { date: "Feb 8", usage: 0 },
        { date: "Feb 9", usage: 0 },
        { date: "Feb 10", usage: 0 },
        { date: "Feb 11", usage: 0 },
        { date: "Feb 12", usage: 0 },
        { date: "Feb 13", usage: 0 },
    ];

    // Mock breakdown data
    const breakdownData = [
        { date: "Feb 1, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 2, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 3, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 4, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 5, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 6, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 7, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 8, 2026", grossAmount: "$0.04", billedAmount: "$0" },
        { date: "Feb 9, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 10, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 11, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 12, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
        { date: "Feb 13, 2026", grossAmount: "<$0.01", billedAmount: "$0" },
    ];

    const maxUsage = Math.max(...usageData.map((d) => d.usage));

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gh-text tracking-tight">
                    Metered usage
                </h1>
                <button className="px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[18px]">download</span>
                    Get usage report
                </button>
            </header>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[300px] relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gh-text-secondary !text-[18px]">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search or filter usage"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-lg text-sm text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:border-primary"
                    />
                </div>
                <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    aria-label="Group by"
                    className="px-3 py-2 bg-gh-bg-secondary border border-gh-border rounded-lg text-sm text-gh-text"
                >
                    <option value="none">Group by: None</option>
                    <option value="product">Group by: Product</option>
                    <option value="repository">Group by: Repository</option>
                </select>
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    aria-label="Timeframe"
                    className="px-3 py-2 bg-gh-bg-secondary border border-gh-border rounded-lg text-sm text-gh-text"
                >
                    <option value="current-month">Timeframe: Current month</option>
                    <option value="last-month">Timeframe: Last month</option>
                    <option value="last-3-months">Timeframe: Last 3 months</option>
                </select>
            </div>

            {/* Chart Section */}
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-gh-text mb-1">Metered usage</h3>
                        <p className="text-xs text-gh-text-secondary">Feb 1 - Feb 29, 2026</p>
                    </div>
                    <button className="text-gh-text-secondary hover:text-gh-text">
                        <span className="material-symbols-outlined !text-[20px]">more_horiz</span>
                    </button>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-primary"></div>
                        <span className="text-xs text-gh-text">Usage</span>
                    </div>
                </div>

                {/* Chart */}
                <div className="relative h-64">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gh-text-secondary">
                        <span>${maxUsage.toFixed(2)}</span>
                        <span>${(maxUsage * 0.5).toFixed(2)}</span>
                        <span>$0</span>
                    </div>

                    {/* Chart area */}
                    <div className="ml-8 h-full pb-8 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            <div className="border-t border-gh-border"></div>
                            <div className="border-t border-gh-border"></div>
                            <div className="border-t border-gh-border"></div>
                        </div>

                        {/* Data points and line */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            {/* Line path */}
                            <polyline
                                points={usageData
                                    .map((d, i) => {
                                        const x = (i / (usageData.length - 1)) * 100;
                                        const y = 100 - (d.usage / maxUsage) * 100;
                                        return `${x},${y}`;
                                    })
                                    .join(" ")}
                                fill="none"
                                stroke="rgb(59, 130, 246)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            {/* Data points */}
                            {usageData.map((d, i) => {
                                const x = (i / (usageData.length - 1)) * 100;
                                const y = 100 - (d.usage / maxUsage) * 100;
                                return (
                                    <circle
                                        key={i}
                                        cx={`${x}%`}
                                        cy={`${y}%`}
                                        r="4"
                                        fill="rgb(59, 130, 246)"
                                        className="hover:r-6 cursor-pointer transition-all"
                                    />
                                );
                            })}
                        </svg>

                        {/* Tooltip on hover (Feb 6 spike) */}
                        <div className="absolute left-[46%] top-[20%] bg-gh-bg border border-gh-border rounded-lg p-3 text-xs shadow-xl pointer-events-none opacity-0 hover:opacity-100">
                            <p className="font-bold text-gh-text mb-2">Usage Friday, 6 Feb, 2026</p>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-primary">● Gross</span>
                                    <span className="text-gh-text font-mono">$0.00</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-emerald-400">● Billed</span>
                                    <span className="text-gh-text font-mono">$0.00</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-purple-400">● Discount</span>
                                    <span className="text-gh-text font-mono">$0.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="ml-8 flex justify-between text-xs text-gh-text-secondary mt-2">
                        {usageData.filter((_, i) => i % 2 === 0).map((d) => (
                            <span key={d.date}>{d.date}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Usage Breakdown Table */}
            <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gh-border">
                    <h3 className="text-sm font-bold text-gh-text">Usage breakdown</h3>
                    <p className="text-xs text-gh-text-secondary mt-1">
                        Usage for Feb 1 - Feb 29, 2026. For license-based products, the prorated is a prorated portion of the monthly price.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gh-bg">
                            <tr className="text-xs text-gh-text-secondary font-bold">
                                <th className="text-left px-4 py-3 w-12"></th>
                                <th className="text-left px-4 py-3">Date</th>
                                <th className="text-right px-4 py-3">Gross amount</th>
                                <th className="text-right px-4 py-3">Billed amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gh-border">
                            {breakdownData.map((row, index) => (
                                <tr key={index} className="hover:bg-gh-bg/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <button className="text-gh-text-secondary hover:text-gh-text">
                                            <span className="material-symbols-outlined !text-[16px]">
                                                chevron_right
                                            </span>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gh-text">{row.date}</td>
                                    <td className="px-4 py-3 text-sm text-gh-text text-right font-mono">
                                        {row.grossAmount}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gh-text text-right font-mono">
                                        {row.billedAmount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingUsage;
