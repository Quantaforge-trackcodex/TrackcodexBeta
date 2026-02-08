import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profileService, UserProfile } from "../services/profile";
import { activityService, Activity } from "../services/activityService";
import { githubService } from "../services/github";
import { useAuth } from "../context/AuthContext";

export default function ResumeProfile() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<Record<string, number>>({});
    // const [activities, setActivities] = useState<Activity[]>([]); // validation: removed unused
    const [repos, setRepos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadData();
        }
    }, [userId]);

    const loadData = async () => {
        setLoading(true);
        try {
            let targetId = userId;
            if (userId === "me") {
                // If "me", use the logged in user's ID or username
                // For this mock service, we can iterate to find the default profile or just use a specific call
                const local = profileService.getProfile();
                targetId = local.username;
            }

            // If targetId is still not resolved or we want to use the unified getUser
            const profileData = userId === "me"
                ? profileService.getProfile()
                : profileService.getUser(targetId || "") || profileService.getProfile(); // Fallback to current if not found for demo

            const statsData = await activityService.getActivityStats(targetId || "me");
            const activityData = await activityService.getUserActivity(targetId || "me", 1, 100);

            setProfile(profileData);
            setStats(statsData);
            // setActivities(activityData.activities);

            // Fetch repos separately as it might fail or need token
            try {
                // For public view, we might rely on cached or public data
                // mocked for now as real github service needs a token primarily for the *viewer*
                // In a real app we'd have a backend proxy for public data
                const token = localStorage.getItem("trackcodex_git_token");
                if (token) {
                    const repoData = await githubService.getRepos(token);
                    setRepos(repoData.slice(0, 6)); // Top 6
                }
            } catch (e) {
                console.warn("Could not load repos for resume", e);
            }

        } catch (error) {
            console.error("Error loading resume data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
                <button onClick={() => navigate("/")} className="text-blue-400 hover:underline">Return Home</button>
            </div>
        );
    }

    const totalActivities = Object.values(stats).reduce((a, b) => a + b, 0);

    // Calculate top languages from repos (mock logic for demo if repos empty)
    const languages = repos.reduce((acc: any, repo: any) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const topLanguages = Object.entries(languages)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5)
        .map(([lang]) => lang);

    return (
        <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans p-4 md:p-8 flex justify-center">
            <style>
                {`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background-color: #0d1117 !important;
                    }
                    /* Ensure global scrollbar is hidden in print */
                    ::-webkit-scrollbar {
                        display: none;
                    }
                }
                `}
            </style>
            <div className="max-w-4xl w-full space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white flex items-center justify-center gap-3">
                        👋 {profile.name}! <span className="text-3xl">🎮 ✨</span>
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 font-mono">
                        <span className="flex items-center gap-2">Vibing to epic beats 🎧</span>
                        <span className="flex items-center gap-2">|</span>
                        <span className="flex items-center gap-2">Coding trading bots 🤖</span>
                        <span className="flex items-center gap-2">|</span>
                        <span className="flex items-center gap-2">Charting markets like a shinobi 📈</span>
                    </div>

                    <p className="text-slate-400 max-w-2xl mx-auto">
                        {profile.role || "A Python-slinging, algo-trading, anime-loving dreamer on a quest to conquer code and markets!"} 🚀
                    </p>


                    <div className="flex justify-center gap-4 py-4 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-full shadow-lg transition-all flex items-center gap-2 hover:scale-105"
                        >
                            <span className="text-lg">🖨️</span> Download / Print PDF
                        </button>
                    </div>

                    <div className="flex justify-center py-6">
                        <img
                            src={profile.avatar}
                            alt="Profile"
                            className="w-32 h-32 md:w-40 md:h-40 rounded-xl shadow-2xl border-4 border-[#161b22]"
                        />
                    </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-[#30363d] w-full"></div>

                {/* My Vibe Statement */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-400 text-xl">🎧</span> My Vibe Statement
                    </h2>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6 font-mono text-sm leading-relaxed text-slate-400 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                        <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                            🎶 + ☕ + 💻 = Ultimate Flow State
                        </div>
                        <p>
                            {profile.bio || "From slicing through Python code like a samurai to backtesting strategies with ninja precision, I'm always chasing the next level. Add a lo-fi anime OST, and I'm unstoppable. Let's grind, trade, and vibe! ⚡"}
                        </p>
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px bg-[#30363d] w-full"></div>

                {/* Tech Stack & Arsenal */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-pink-500 text-xl">🚀</span> Tech Stack & Arsenal
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">My toolkit for coding, trading, and slaying projects:</p>

                    <div className="flex flex-wrap gap-3">
                        {/* Mock badges for the visual style requested */}
                        <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" className="h-8 hover:scale-105 transition-transform" />
                        <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JS" className="h-8 hover:scale-105 transition-transform" />
                        <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" className="h-8 hover:scale-105 transition-transform" />
                        <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next" className="h-8 hover:scale-105 transition-transform" />
                        <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" className="h-8 hover:scale-105 transition-transform" />
                        <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="Mongo" className="h-8 hover:scale-105 transition-transform" />
                        {/* Add dynamic skills as badges if needed, currently hardcoded to match "Arsenal" look */}
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px bg-[#30363d] w-full"></div>

                {/* GitHub Stats & Grind */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-blue-400 text-xl">📈</span> GitHub Stats & Grind
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stats Card Mimic */}
                        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 relative overflow-hidden transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
                            <h3 className="text-blue-400 font-bold mb-4">{profile.name}'s GitHub Stats</h3>
                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="text-white">⭐</span> Total Stars Earned:</span>
                                    <span className="font-bold">{stats.stars || 120}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="text-white">🔃</span> Total Commits:</span>
                                    <span className="font-bold">{stats.commits || 405}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="text-white">🔀</span> Total PRs:</span>
                                    <span className="font-bold">{stats.pull_requests || 12}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="text-white">🐞</span> Total Issues:</span>
                                    <span className="font-bold">{stats.issues || 8}</span>
                                </div>
                            </div>
                        </div>

                        {/* Streak Card Mimic */}
                        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 flex items-center justify-around text-center transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10">
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">{totalActivities}</div>
                                <div className="text-xs text-slate-500">Total Contributions</div>
                            </div>
                            <div className="w-px h-12 bg-[#30363d]"></div>
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">🔥 {stats.streak || 4}</div>
                                <div className="text-xs text-slate-500">Current Streak</div>
                            </div>
                            <div className="w-px h-12 bg-[#30363d]"></div>
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">⚡ {stats.longestStreak || 12}</div>
                                <div className="text-xs text-slate-500">Longest Streak</div>
                            </div>
                        </div>
                    </div>

                    {/* Most Used Languages */}
                    <div className="mt-4 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 transition-all hover:border-purple-500/30">
                        <h3 className="text-blue-400 font-bold mb-4">Most Used Languages</h3>
                        <div className="flex h-3 rounded-full overflow-hidden mb-4">
                            <div className="bg-yellow-400 w-[47%]"></div>
                            <div className="bg-blue-500 w-[24%]"></div>
                            <div className="bg-orange-500 w-[15%]"></div>
                            <div className="bg-purple-500 w-[14%]"></div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> JavaScript 47%</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> TypeScript 24%</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> HTML 15%</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> CSS 14%</span>
                        </div>
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px bg-[#30363d] w-full"></div>

                {/* Epic Projects & Quests */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-green-500 text-xl">🧪</span> Epic Projects & Quests
                    </h2>

                    <div className="space-y-4 font-mono text-sm text-slate-400">
                        {repos.length > 0 ? repos.map((repo, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="mt-1">🔹</span>
                                <div>
                                    <strong className="text-white hover:underline cursor-pointer">{repo.name}</strong>
                                    <span className="mx-2 text-slate-600">:</span>
                                    {repo.description || "A legendary project built with code and caffeine."}
                                </div>
                            </div>
                        )) : (
                            <>
                                <div className="flex items-start gap-2">
                                    <span className="mt-1">🤖</span>
                                    <div>
                                        <strong className="text-white">Crypto Scanner Bot</strong> <span className="mx-2 text-slate-600">:</span> Real-time market scanner with Telegram alerts.
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-1">📈</span>
                                    <div>
                                        <strong className="text-white">TradingView Strategy</strong> <span className="mx-2 text-slate-600">:</span> Custom PineScript strategy for max gains.
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-1">⚡</span>
                                    <div>
                                        <strong className="text-white">Flash Loan Arbitrage</strong> <span className="mx-2 text-slate-600">:</span> Solidity contracts for DeFi opportunities.
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mt-4 pt-2">
                            <a href={`https://github.com/${profile.username}`} className="text-blue-400 hover:underline italic">Level up with my repos! ↗</a>
                        </div>
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px bg-[#30363d] w-full"></div>

                {/* Mission & Endgame */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-pink-500 text-xl">🎯</span> My Mission & Endgame
                    </h2>
                    <div className="space-y-3 text-sm text-slate-400 font-mono">
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">⚡ Grinding Now:</span>
                            <span>Mastering AI x Finance for next-gen trading systems.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-pink-400">🔮 Ultimate Quest:</span>
                            <span>Build an AI-powered "Aladdin" to dominate markets and automation.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-red-400">🗡️ Side Quests:</span>
                            <span>Sharpening trading edges, conquering LeetCode, and indie hacking.</span>
                        </div>
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px bg-[#30363d] w-full"></div>

                {/* Footer / Contact */}
                <section className="pb-12 text-center md:text-left print:hidden">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                        <span className="text-yellow-500 text-xl">🤝</span> Let's Team Up!
                    </h2>
                    <p className="text-slate-500 mb-6">Ready to vibe on code, charts, or anime? Hit me up! 📨</p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#0077b5] text-white text-sm font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:opacity-90 hover:-translate-y-1 transition-all shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined !text-lg">work</span> LinkedIn
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-black text-white border border-white/20 text-sm font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-white hover:text-black hover:-translate-y-1 transition-all shadow-lg">
                            <span className="material-symbols-outlined !text-lg">flutter_dash</span> X / Twitter
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-[#0088cc] text-white text-sm font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:opacity-90 hover:-translate-y-1 transition-all shadow-lg shadow-cyan-500/20">
                            <span className="material-symbols-outlined !text-lg">send</span> Telegram
                        </a>
                        <a href={`mailto:${profile.email}`} className="px-6 py-2.5 bg-[#ea4335] text-white text-sm font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:opacity-90 hover:-translate-y-1 transition-all shadow-lg shadow-red-500/20">
                            <span className="material-symbols-outlined !text-lg">mail</span> Email Me
                        </a>
                    </div>
                </section>

            </div>
        </div>
    );
}
