import React from 'react';
import { Repository, Organization } from '../../types';
import { useNavigate, useOutletContext } from 'react-router-dom';

const OrgRepositories = () => {
    const { org } = useOutletContext<{ org: Organization }>();
    const repos = org.repositories;
    const navigate = useNavigate();
    
    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <input
                    placeholder="Find a repository..."
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none w-80"
                />
                <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-all">
                    New
                </button>
            </div>
            <div className="border-t border-[#30363d]">
                {repos.map(repo => (
                    <div key={repo.id} className="py-5 border-b border-[#30363d] flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 
                                    onClick={() => navigate(`/repo/${repo.id}`)}
                                    className="text-lg font-bold text-primary hover:underline cursor-pointer"
                                >
                                    {repo.name}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] font-bold text-slate-400 uppercase">
                                    {repo.visibility}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">{repo.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5"><div className="size-2.5 rounded-full" style={{ backgroundColor: repo.techColor }}></div> {repo.techStack}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined !text-base">star</span> {repo.stars}</span>
                                <span>Updated {repo.lastUpdated}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrgRepositories;
