import React from 'react';
import { Team, Organization } from '../../types';
import { useOutletContext } from 'react-router-dom';

const OrgTeams = () => {
    const { org } = useOutletContext<{ org: Organization }>();
    const teams = org.teams;
    
    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <input
                    placeholder="Find a team..."
                    className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none w-80"
                />
                <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined !text-lg">group_add</span>
                    New team
                </button>
            </div>
            <div className="border-t border-[#30363d]">
                {teams.map(team => (
                    <div key={team.id} className="py-4 border-b border-[#30363d] flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined">groups</span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors cursor-pointer">{team.name}</h3>
                                <p className="text-sm text-slate-400 mt-1">{team.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                           <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-base">group</span> {team.memberCount} members</span>
                           <span className="flex items-center gap-1.5"><span className="material-symbols-outlined !text-base">account_tree</span> {team.repoCount} repositories</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrgTeams;
