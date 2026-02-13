import React, { useState } from "react";

interface Task {
    id: string;
    title: string;
    description?: string;
    labels: string[];
    assignees: number;
    comments: number;
    subtasks?: { completed: number; total: number };
    date?: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const labelColors: { [key: string]: string } = {
        Urgent: "bg-purple-600",
        Research: "bg-orange-600",
        Design: "bg-purple-500",
        "Needs Design": "bg-red-600",
        Blocked: "bg-red-600",
        Audit: "bg-blue-600",
        Interaction: "bg-orange-500",
        Assistance: "bg-purple-500",
    };

    return (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-3 mb-3 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="flex items-start gap-2 mb-2">
                {task.labels.map((label, idx) => (
                    <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${labelColors[label] || "bg-gray-600"}`}
                    >
                        {label}
                    </span>
                ))}
            </div>
            <h3 className="text-sm font-bold text-gh-text mb-1 group-hover:text-primary transition-colors">
                {task.title}
            </h3>
            {task.description && (
                <p className="text-xs text-gh-text-secondary line-clamp-2 mb-2">
                    {task.description}
                </p>
            )}
            <div className="flex items-center gap-3 text-[11px] text-gh-text-secondary">
                {task.date && (
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">event</span>
                        {task.date}
                    </span>
                )}
                {task.subtasks && (
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">check_box</span>
                        {task.subtasks.completed}/{task.subtasks.total}
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined !text-[14px]">comment</span>
                    {task.comments}
                </span>
                {task.assignees > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined !text-[14px]">group</span>
                        {task.assignees}
                    </span>
                )}
            </div>
        </div>
    );
};

const TaskColumn: React.FC<{ column: Column }> = ({ column }) => {
    return (
        <div className="flex-1 min-w-[280px] bg-gh-bg-tertiary rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gh-text">{column.title}</h2>
                <button className="text-gh-text-secondary hover:text-gh-text">
                    <span className="material-symbols-outlined !text-[18px]">more_horiz</span>
                </button>
            </div>
            <div className="space-y-0">
                {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                <button className="w-full py-2 text-xs text-gh-text-secondary hover:text-gh-text flex items-center justify-center gap-2 border border-dashed border-gh-border rounded-lg hover:border-primary/50 transition-all">
                    <span className="material-symbols-outlined !text-[16px]">add</span>
                    Add task
                </button>
            </div>
        </div>
    );
};

const TaskVault = () => {
    const [activeTab, setActiveTab] = useState("Board");

    const mockData: Column[] = [
        {
            id: "todo",
            title: "To Do",
            tasks: [
                {
                    id: "1",
                    title: "Implement drag-and-drop for task filters",
                    description: "Add real-time drag-and-drop with smooth animations",
                    labels: ["Urgent", "Interaction"],
                    assignees: 0,
                    comments: 2,
                    subtasks: { completed: 2, total: 4 },
                    date: "July 8",
                },
                {
                    id: "2",
                    title: "Write unit tests for task filters",
                    description: "Mock task filtering logic using complex stories about Star Wars",
                    labels: ["Research"],
                    assignees: 2,
                    comments: 12,
                    subtasks: { completed: 0, total: 10 },
                },
                {
                    id: "3",
                    title: "Add loading assistance to task",
                    labels: ["Urgent", "Assistance"],
                    assignees: 0,
                    comments: 0,
                },
            ],
        },
        {
            id: "inprogress",
            title: "In Progress",
            tasks: [
                {
                    id: "4",
                    title: "Build column reorder functionality",
                    description: "User should be able to reorder columns",
                    labels: ["Urgent", "Interaction"],
                    assignees: 2,
                    comments: 4,
                    subtasks: { completed: 4, total: 7 },
                    date: "July 8",
                },
            ],
        },
        {
            id: "inreview",
            title: "In Review",
            tasks: [
                {
                    id: "5",
                    title: "Refactor task card component for modularity",
                    labels: ["Design", "Needs Design", "Blocked"],
                    assignees: 0,
                    comments: 0,
                    date: "July 8",
                },
                {
                    id: "6",
                    title: "Document API endpoints for task CRUD operations",
                    description: "Add documentation to better solve complex client side",
                    labels: ["Research", "Urgent"],
                    assignees: 0,
                    comments: 12,
                    subtasks: { completed: 1, total: 11 },
                },
            ],
        },
        {
            id: "done",
            title: "Done",
            tasks: [
                {
                    id: "7",
                    title: "Create initial column layout (QA, In Progress, Done)",
                    labels: ["Research", "Audit"],
                    assignees: 2,
                    comments: 1,
                    date: "July 8",
                },
            ],
        },
    ];

    const tabs = ["Overview", "Lists", "Board", "Timeline", "Files"];

    return (
        <div className="flex-1 overflow-y-auto bg-gh-bg font-display">
            {/* Header */}
            <div className="border-b border-gh-border bg-gh-bg-secondary">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-black text-gh-text">Tasks</h1>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-gh-bg border border-gh-border rounded-lg px-3 py-1.5 text-sm text-gh-text placeholder-gh-text-secondary w-64 focus:outline-none focus:border-primary"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gh-text-secondary text-xs">
                                    ⌘ F
                                </span>
                            </div>
                            <button className="px-3 py-1.5 bg-gh-bg-tertiary border border-gh-border rounded-lg text-sm text-gh-text hover:bg-gh-bg hover:border-primary/50 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined !text-[16px]">tune</span>
                                Status: All
                            </button>
                            <button className="px-3 py-1.5 bg-gh-bg-tertiary border border-gh-border rounded-lg text-sm text-gh-text hover:bg-gh-bg hover:border-primary/50 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined !text-[16px]">sort</span>
                                Sort
                            </button>
                            <button className="px-3 py-1.5 bg-gh-bg-tertiary border border-gh-border rounded-lg text-sm text-gh-text hover:bg-gh-bg hover:border-primary/50 transition-all">
                                <span className="material-symbols-outlined !text-[16px]">more_vert</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                    ? "border-primary text-gh-text"
                                    : "border-transparent text-gh-text-secondary hover:text-gh-text"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            {activeTab === "Board" && (
                <div className="p-6">
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {mockData.map((column) => (
                            <TaskColumn key={column.id} column={column} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== "Board" && (
                <div className="p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gh-text-secondary mb-4 block">
                        construction
                    </span>
                    <h2 className="text-xl font-bold text-gh-text mb-2">{activeTab} View</h2>
                    <p className="text-gh-text-secondary">This view is coming soon...</p>
                </div>
            )}
        </div>
    );
};

export default TaskVault;
