import React, { useState } from 'react';
import { Organization } from '../../types';

const OrgSettings = ({ org }: { org: Organization }) => {
    const [name, setName] = useState(org.name);
    const [description, setDescription] = useState(org.description);

    return (
        <div className="animate-in fade-in duration-500 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-[#30363d]">Organization profile</h2>
            <div className="space-y-6">
                <div>
                    <label className="text-sm font-bold text-slate-300">Organization display name</label>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-slate-300">Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white h-24 resize-none focus:ring-1 focus:ring-primary outline-none" 
                    />
                </div>
                <div className="pt-4 flex justify-start">
                    <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-all">
                        Update profile
                    </button>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-rose-500/20">
                 <h3 className="text-lg font-bold text-rose-500 mb-2">Danger Zone</h3>
                 <div className="p-4 border border-rose-500/30 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="font-bold text-white">Delete this organization</p>
                        <p className="text-xs text-slate-400">Once you delete an organization, there is no going back. Please be certain.</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all">
                        Delete organization
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default OrgSettings;
