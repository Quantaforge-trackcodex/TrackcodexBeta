import React from 'react';
import { OrgMember, Organization } from '../../types';
import { useOutletContext } from 'react-router-dom';

const OrgPeople = () => {
    const { org } = useOutletContext<{ org: Organization }>();
    const members = org.members;
    
    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Find a member..."
                        className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none w-80"
                    />
                    <button className="px-4 py-2 text-sm bg-[#21262d] border border-[#30363d] rounded-lg text-white">Role: All</button>
                </div>
                <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined !text-lg">person_add</span>
                    Invite member
                </button>
            </div>
            <div className="border-t border-[#30363d]">
                {members.map(member => (
                    <div key={member.username} className="py-4 border-b border-[#30363d] flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <img src={member.avatar} className="size-12 rounded-full" />
                            <div>
                                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors cursor-pointer">{member.name}</h3>
                                <p className="text-sm text-slate-400">@{member.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">{member.role}</span>
                            <span className="text-sm text-slate-500">Last active {member.lastActive}</span>
                            <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-opacity">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrgPeople;
