import React, { useState } from 'react';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (e: boolean) => void }) => (
    <button type="button" onClick={() => onChange(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-slate-600'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const members = [
    { name: 'Alice Dev', email: 'alice@trackcodex.com', avatar: 'https://picsum.photos/seed/alice/64', role: 'Admin', status: 'Active' },
    { name: 'Bob Coder', email: 'bob.coder@trackcodex.com', avatar: 'https://picsum.photos/seed/bob/64', role: 'Write', status: 'Active' },
    { name: 'Charlie Junior', email: 'charlie@trackcodex.com', avatar: 'https://picsum.photos/seed/charlie/64', role: 'Read', status: 'Pending' },
];

const OrgPermissions = () => {
    const [permissions, setPermissions] = useState({
        createRepos: true,
        deleteBranches: true,
        publicAccess: false,
        require2FA: true
    });

    return (
        <div className="max-w-5xl space-y-12">
            <div>
                <h1 className="text-2xl font-bold text-white">Permissions & Access</h1>
                <p className="text-sm text-slate-400 mt-1">Manage workspace roles, invite members, and configure global security policies for your team.</p>
            </div>
            
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Member Roles</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                           <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-base">search</span>
                           <input placeholder="Filter by member..." className="w-64 bg-gh-bg-secondary border border-gh-border rounded-lg pl-9 pr-4 py-2 text-sm text-white" />
                        </div>
                        <button className="px-4 py-2 text-sm bg-primary rounded-lg text-white font-bold hover:bg-blue-600 transition-colors">Invite Member</button>
                    </div>
                </div>

                <div className="bg-gh-bg-secondary border border-gh-border rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black/20">
                            <tr className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gh-border">
                            {members.map(m => (
                                <tr key={m.email} className="text-sm text-slate-300">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={m.avatar} className="size-9 rounded-full" />
                                            <div>
                                                <p className="font-bold text-white">{m.name}</p>
                                                <p className="text-xs text-slate-500">{m.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select defaultValue={m.role} className="bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm w-32">
                                            <option>Admin</option>
                                            <option>Write</option>
                                            <option>Read</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${m.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{m.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     <div className="p-3 bg-black/20 border-t border-gh-border flex items-center justify-between text-xs text-slate-400">
                        <span>Showing 1 to 3 of 12 members</span>
                        <div className="flex items-center gap-2">
                            <button className="size-7 flex items-center justify-center bg-gh-bg border border-gh-border rounded"><span className="material-symbols-outlined !text-sm">chevron_left</span></button>
                            <button className="size-7 flex items-center justify-center bg-gh-bg border border-gh-border rounded"><span className="material-symbols-outlined !text-sm">chevron_right</span></button>
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                 <h2 className="text-lg font-bold text-white mb-4">Global Permissions</h2>
                 <div className="bg-gh-bg-secondary border border-gh-border rounded-lg divide-y divide-gh-border">
                    <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">Allow members to create repositories</p>
                            <p className="text-xs text-slate-400 mt-1">Members with Write access or higher can create new private repositories within this workspace.</p>
                        </div>
                        <ToggleSwitch enabled={permissions.createRepos} onChange={(e) => setPermissions(p => ({...p, createRepos: e}))} />
                    </div>
                     <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">Restrict branch deletion</p>
                            <p className="text-xs text-slate-400 mt-1">Only workspace administrators can delete protected branches in any repository.</p>
                        </div>
                        <ToggleSwitch enabled={permissions.deleteBranches} onChange={(e) => setPermissions(p => ({...p, deleteBranches: e}))} />
                    </div>
                     <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">Enable public access</p>
                            <p className="text-xs text-slate-400 mt-1">Allow repositories within this workspace to be changed to public visibility.</p>
                        </div>
                        <ToggleSwitch enabled={permissions.publicAccess} onChange={(e) => setPermissions(p => ({...p, publicAccess: e}))} />
                    </div>
                     <div className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white">Require Two-Factor Authentication</p>
                            <p className="text-xs text-slate-400 mt-1">All members must have 2FA enabled to access this workspace.</p>
                        </div>
                        <ToggleSwitch enabled={permissions.require2FA} onChange={(e) => setPermissions(p => ({...p, require2FA: e}))} />
                    </div>
                 </div>
                 <div className="flex justify-end gap-3 mt-6">
                    <button className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
                    <button className="px-5 py-2 text-sm bg-primary rounded-lg text-white font-bold hover:bg-blue-600 transition-colors">Save Changes</button>
                </div>
            </section>
        </div>
    );
};

export default OrgPermissions;
