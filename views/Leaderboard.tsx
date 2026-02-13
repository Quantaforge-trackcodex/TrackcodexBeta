import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../services/profile";

interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    handle: string;
    avatar: string;
    wins: number;
    matches: number;
    points: number;
    gems: string;
    diamonds: string;
    bestWin?: string;
}

const Leaderboard = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 6, mins: 42 });
    const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const profile = await profileService.getProfile();
                // Mock stats for the current user since we don't have a backend yet
                setCurrentUser({
                    id: "current-user-id",
                    rank: 42,
                    name: profile.name,
                    handle: profile.username || "@me",
                    avatar: profile.avatar,
                    wins: 156,
                    matches: 342,
                    points: 12450,
                    gems: "5,200",
                    diamonds: "2,100",
                    bestWin: "1:45",
                });
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };
        fetchUser();
    }, []);

    const handleUserClick = (userId: string) => {
        navigate(`/portfolio/${userId}`);
    };

    // Mock Data
    const topUsers: LeaderboardUser[] = [
        {
            id: "1",
            rank: 1,
            name: "Blademir Malina Tori",
            handle: "@popy_bob",
            avatar: "https://i.pravatar.cc/150?u=1",
            wins: 443,
            matches: 778,
            points: 44872,
            gems: "32,421",
            diamonds: "17,500",
            bestWin: "1:05",
        },
        {
            id: "2",
            rank: 2,
            name: "Robert Fox",
            handle: "@robert_fox",
            avatar: "https://i.pravatar.cc/150?u=2",
            wins: 440,
            matches: 887,
            points: 42515,
            gems: "31,001",
            diamonds: "17,421",
            bestWin: "1:03",
        },
        {
            id: "3",
            rank: 3,
            name: "Molida Glinda",
            handle: "@molida_glinda",
            avatar: "https://i.pravatar.cc/150?u=3",
            wins: 412,
            matches: 756,
            points: 40550,
            gems: "30,987",
            diamonds: "17,224",
            bestWin: "1:15",
        },
    ];

    const upcomingUsers: LeaderboardUser[] = [
        {
            id: "4",
            rank: 4,
            name: "Jenny Wilson",
            handle: "@jenny_wilson",
            avatar: "https://i.pravatar.cc/150?u=4",
            wins: 398,
            matches: 720,
            points: 38200,
            gems: "28,500",
            diamonds: "15,800",
            bestWin: "1:20",
        },
        {
            id: "5",
            rank: 5,
            name: "Guy Hawkins",
            handle: "@guy_hawkins",
            avatar: "https://i.pravatar.cc/150?u=5",
            wins: 385,
            matches: 690,
            points: 36750,
            gems: "27,100",
            diamonds: "14,900",
            bestWin: "1:25",
            bestWin: "1:25",
        },
    ];

    return (
        <div className="min-h-screen bg-[#0d1117] text-white p-8 pb-32 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Total Registered */}
                    <div className="bg-[#161b22] p-6 rounded-2xl border border-[#30363d] flex items-center justify-between">
                        <div>
                            <div className="text-4xl font-bold mb-1">1277</div>
                            <div className="text-[#8b949e] text-sm">Total Registered</div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>

                    {/* Total Participated */}
                    <div className="bg-[#161b22] p-6 rounded-2xl border border-[#30363d] flex items-center justify-between">
                        <div>
                            <div className="text-4xl font-bold mb-1">255</div>
                            <div className="text-[#8b949e] text-sm">Total Participated</div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <span className="material-symbols-outlined">emoji_events</span>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="bg-[#161b22] p-6 rounded-2xl border border-[#30363d] flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#8b949e]">Remaining time for completion🔥</span>
                        </div>
                        <div className="flex items-center gap-4 text-3xl font-mono font-bold">
                            <div>
                                {timeLeft.days} <span className="text-xs text-[#8b949e] font-sans block text-center">DAYS</span>
                            </div>
                            <span className="text-[#8b949e]">:</span>
                            <div>
                                {timeLeft.hours} <span className="text-xs text-[#8b949e] font-sans block text-center">HRS</span>
                            </div>
                            <span className="text-[#8b949e]">:</span>
                            <div>
                                {timeLeft.mins} <span className="text-xs text-[#8b949e] font-sans block text-center">MINS</span>
                            </div>
                        </div>
                        <div className="text-xs text-[#8b949e] mt-2">Only the first three positions will be awarded prizes</div>
                    </div>
                </div>

                {/* Podium Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {topUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`bg-[#161b22] rounded-2xl p-6 border relative ${user.rank === 1 ? "border-yellow-500/50" : "border-[#30363d]"
                                }`}
                        >
                            {/* Rank Badge */}
                            <div
                                className={`absolute -top-3 left-6 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${user.rank === 1
                                    ? "bg-yellow-500 text-black"
                                    : user.rank === 2
                                        ? "bg-blue-500 text-white"
                                        : "bg-purple-500 text-white"
                                    }`}
                            >
                                {user.rank}
                            </div>

                            {user.rank === 1 && (
                                <div className="absolute top-4 right-6">
                                    <span className="text-4xl">🥇</span>
                                </div>
                            )}

                            <div
                                className="flex items-center gap-4 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleUserClick(user.id)}
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className={`w-16 h-16 rounded-full border-2 ${user.rank === 1 ? "border-yellow-500" : user.rank === 2 ? "border-blue-500" : "border-purple-500"
                                        }`}
                                />
                                <div>
                                    <h3 className="font-bold text-lg leading-tight hover:text-blue-400 transition-colors">{user.name}</h3>
                                    <p className="text-[#8b949e] text-sm">{user.handle}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                <div>
                                    <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Wins</div>
                                    <div className="font-bold text-lg">{user.wins}</div>
                                </div>
                                <div>
                                    <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Matches</div>
                                    <div className="font-bold text-lg">{user.matches}</div>
                                </div>
                                <div>
                                    <div className="text-[#8b949e] text-xs uppercase tracking-wider mb-1">Points</div>
                                    <div className="font-bold text-lg">{user.points.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-[#30363d]">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500 text-sm">inventory_2</span>
                                    <span className="font-bold">{user.gems}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-400 text-sm">diamond</span>
                                    <span className="font-bold">{user.diamonds}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Stats Card */}
                {currentUser && (
                    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 flex items-center justify-between relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center px-4">
                                <span className="text-[10px] text-[#8b949e] uppercase tracking-wider mb-1">Your Rank</span>
                                <div className="text-3xl font-bold text-white">#{currentUser.rank}</div>
                            </div>

                            <div className="h-10 w-px bg-[#30363d]"></div>

                            <div
                                className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleUserClick(currentUser.id)}
                            >
                                <img
                                    src={currentUser.avatar}
                                    alt={currentUser.name}
                                    className="w-12 h-12 rounded-full border-2 border-[#30363d]"
                                />
                                <div>
                                    <div className="font-bold text-xl text-white leading-tight hover:text-blue-400 transition-colors">{currentUser.name}</div>
                                    <div className="text-sm text-[#8b949e]">{currentUser.points.toLocaleString()} Points</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 hidden sm:flex pr-4">
                            <div className="text-center">
                                <div className="text-[10px] text-[#8b949e] uppercase font-bold mb-1">Wins</div>
                                <div className="font-mono text-xl">{currentUser.wins}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-[#8b949e] uppercase font-bold mb-1">Matches</div>
                                <div className="font-mono text-xl">{currentUser.matches}</div>
                            </div>
                            <div className="text-center hidden md:block">
                                <div className="text-[10px] text-[#8b949e] uppercase font-bold mb-1">Best Win</div>
                                <div className="font-mono text-xl text-emerald-400">{currentUser.bestWin}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Ranking Table */}
                <div className="bg-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden">
                    <div className="p-6 border-b border-[#30363d]">
                        <h2 className="text-xl font-bold">Global Ranking</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0d1117] text-[#8b949e] text-sm border-b border-[#30363d]">
                                    <th className="p-4 pl-6 font-medium">Rank</th>
                                    <th className="p-4 font-medium">User name</th>
                                    <th className="p-4 font-medium text-center">Match Wins</th>
                                    <th className="p-4 font-medium text-center">Spent time</th>
                                    <th className="p-4 font-medium text-center">Victories</th>
                                    <th className="p-4 font-medium text-center">Best Win (mins)</th>
                                    <th className="p-4 pr-6 font-medium text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...topUsers, ...upcomingUsers].map((user) => (
                                    <tr key={user.id} className="border-b last:border-0 border-[#30363d] hover:bg-[#21262d] transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center font-mono text-sm">
                                                {user.rank}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer group"
                                                onClick={() => handleUserClick(user.id)}
                                            >
                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full group-hover:opacity-80 transition-opacity" />
                                                <div>
                                                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">{user.name}</div>
                                                    <div className="text-xs text-[#8b949e]">ID 15876{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-[#8b949e]">{user.wins}</td>
                                        <td className="p-4 text-center text-[#8b949e]">{user.matches}</td>
                                        <td className="p-4 text-center text-[#8b949e]">{Math.floor(user.wins / 10)}</td>
                                        <td className="p-4 text-center text-[#8b949e]">{user.bestWin}</td>
                                        <td className="p-4 pr-6 text-right font-mono font-bold text-white">
                                            {user.points.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
