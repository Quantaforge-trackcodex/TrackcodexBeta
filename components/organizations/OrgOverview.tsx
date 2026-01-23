
import React from 'react';
import { Organization, PinnedRepo } from '../../types';
import { useNavigate, useOutletContext } from 'react-router-dom';

// FIX: Changed component to React.FC to correctly handle the 'key' prop when used in a list.
const PinnedRepoCard: React.FC<{ repo: PinnedRepo }> = ({ repo }) => (
    <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg group hover:border-[#8b949e] transition-all cursor-pointer flex flex-col">
        <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-primary group-hover:underline truncate">{repo.name}</h4>
            <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[9px] text-slate-500 font-black uppercase tracking-widest">
                {repo.isPublic ? 'Public' : 'Private'}
            </span>
        </div>
        <p className="text-xs text-slate-400 leading-normal mb-4 flex-1 line-clamp-2">
            {repo.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
            <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: repo.langColor }}></div>
                <span>{repo.language}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-base">star</span>
                <span>{repo.stars}</span>
            </div>
        </div>
    </div>
);

const OrgOverview = () => {
    const { org } = useOutletContext<{ org: Organization }>();
    const navigate = useNavigate();

    // Mock pinned repos from org repos
    const pinnedRepos: PinnedRepo[] = org.repositories.slice(0, 4).map(r => ({
        name: r.name,
        description: r.description,
        language: r.techStack,
        langColor: r.techColor,
        stars: r.stars.toString(),
        forks: r.forks,
        isPublic: r.isPublic,
    }));

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-8">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">push_pin</span>
                        Pinned
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pinnedRepos.map(repo => <PinnedRepoCard key={repo.name} repo={repo} />)}
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Top languages</h3>
                        <div className="space-y-2">
                            {/* Mock Language Data */}
                            <div className="flex items-center text-xs text-slate-400"><div className="size-3 rounded-full bg-[#00add8] mr-2"></div>Go <span className="ml-auto">65%</span></div>
                            <div className="flex items-center text-xs text-slate-400"><div className="size-3 rounded-full bg-[#3178c6] mr-2"></div>TypeScript <span className="ml-auto">25%</span></div>
                            <div className="flex items-center text-xs text-slate-400"><div className="size-3 rounded-full bg-[#f97316] mr-2"></div>Markdown <span className="ml-auto">10%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgOverview;
