import React from 'react';

interface FreelancerProfile {
    rating: number;
    jobsCompleted: number;
    topCategory: string | null;
    repeatHireRate: number;
    hourlyRate: string | null;
}

interface FreelancerCardProps {
    profile: FreelancerProfile | null;
}

export const FreelancerCard: React.FC<FreelancerCardProps> = ({ profile }) => {
    if (!profile) {
        return (
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-zinc-500 mb-4">No Freelancer Profile Active</p>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm transition-colors">
                    Activate Freelancing
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl backdrop-blur-sm relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/20 transition-all duration-700"></div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <span className="text-emerald-400">💼</span> Freelance Stats
                </h3>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                    Available
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-3 rounded-lg border border-zinc-800/50">
                    <div className="text-sm text-zinc-500 mb-1">Rating</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-1">
                        {profile.rating.toFixed(1)} <span className="text-yellow-500 text-lg">★</span>
                    </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg border border-zinc-800/50">
                    <div className="text-sm text-zinc-500 mb-1">Jobs Done</div>
                    <div className="text-2xl font-bold text-white">{profile.jobsCompleted}</div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg border border-zinc-800/50">
                    <div className="text-sm text-zinc-500 mb-1">Repeat Hire</div>
                    <div className="text-2xl font-bold text-white">{profile.repeatHireRate}%</div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg border border-zinc-800/50">
                    <div className="text-sm text-zinc-500 mb-1">Rate</div>
                    <div className="text-2xl font-bold text-white">{profile.hourlyRate || 'N/A'}</div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Top Skill</span>
                    <span className="text-zinc-200 font-medium">{profile.topCategory || 'Generalist'}</span>
                </div>

                {/* Progress Bar for Profile Completeness/Strength */}
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>Profile Strength</span>
                        <span>92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[92%]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
