import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityHeatmap } from '../components/profile/analytics/ActivityHeatmap';
import { AIUsageChart } from '../components/profile/analytics/AIUsageChart';
import { FreelancerCard } from '../components/profile/analytics/FreelancerCard';
import { api } from '../services/api';

export const ProfileView: React.FC = () => {
    const { username } = useParams<{ username: string }>(); // e.g. /profile/johndoe
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    const [heatmapData, setHeatmapData] = useState<any>(null);
    const [aiData, setAiData] = useState<any>(null);

    // Use a default user for demo if no param
    const targetUser = username || 'testuser';

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Try to fetch real data
                // For prototype, we might need to seed first, so we'll do a robust check

                // 1. Get Profile
                const profileRes = await fetch(`http://localhost:4000/api/v1/profile/${targetUser}`);
                if (!profileRes.ok) {
                    console.warn("User fetch failed, might be demo missing data");
                    // Fallback or show error
                } else {
                    const data = await profileRes.json();
                    setProfileData(data);
                }

                // 2. Get Heatmap (New GitHub Parity Endpoint)
                const heatmapRes = await fetch(`http://localhost:4000/api/v1/profile/${targetUser}/contributions`);
                if (heatmapRes.ok) {
                    const data = await heatmapRes.json();
                    setHeatmapData(data); // { total_contributions, contributions: [], ... }
                }

                // 3. Get AI Usage
                const aiRes = await fetch(`http://localhost:4000/api/v1/profile/${targetUser}/ai-usage`);
                if (aiRes.ok) {
                    const data = await aiRes.json();
                    setAiData(data);
                }

            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [targetUser]);

    const handleSeed = async () => {
        if (!profileData?.user?.id) return;
        setLoading(true);
        await fetch('http://localhost:4000/api/v1/profile/seed-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: profileData.user.id })
        });
        // Reload page or re-fetch
        window.location.reload();
    };

    if (loading && !profileData) {
        return <div className="p-8 text-zinc-400">Loading profile analytics...</div>;
    }

    // Fallback UI if user not found (or first load before seed)
    if (!profileData || !profileData.user) {
        return (
            <div className="p-10 flex flex-col items-center">
                <h2 className="text-xl text-white mb-4">User Found (But maybe no data yet)</h2>
                <p className="text-zinc-400 mb-6">Use the seed button to generate analytics for this user.</p>
                {/* We need at least an ID to seed, so this might be tricky if /profile/:username failed. 
               In a real app, we'd handle 404 better. For now assuming main test user exists. 
           */}
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-black text-zinc-100 p-6">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
                        {profileData.user.avatar ? (
                            <img src={profileData.user.avatar} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{profileData.user.name}</h1>
                        <p className="text-zinc-400">@{profileData.user.username}</p>
                        <div className="flex gap-3 mt-2">
                            <span className="text-sm bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                                {profileData.user.role}
                            </span>
                            <span className="text-sm text-zinc-500">Joined Jan 2026</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSeed}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 text-sm transition-colors"
                    >
                        ⚡ Seed Demo Data
                    </button>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
                        Hire Me
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Main Column (Heatmap + AI) */}
                <div className="xl:col-span-2 space-y-6">
                    <ActivityHeatmap
                        contributions={heatmapData?.contributions || []}
                        total={heatmapData?.total_contributions || 0}
                        from={heatmapData?.from || ''}
                        to={heatmapData?.to || ''}
                    />

                    <AIUsageChart
                        logs={aiData?.logs || []}
                        totalTokens={aiData?.totalTokens || 0}
                    />
                </div>

                {/* Sidebar (Freelance Stats) */}
                <div className="space-y-6">
                    <FreelancerCard profile={profileData.freelancerProfile} />

                    {/* Additional Widget: Skills / Badges could go here */}
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm">
                        <h3 className="text-sm font-semibold text-zinc-300 mb-3">Badges</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">Forge AI Pro</span>
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">Early Adopter</span>
                            <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded border border-orange-500/20">Top Contributor</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
