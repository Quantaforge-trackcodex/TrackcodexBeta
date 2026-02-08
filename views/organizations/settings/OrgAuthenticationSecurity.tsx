import React, { useState } from 'react';

const StatusBadge = ({ status }: { status: 'Mapped' | 'Partial' | 'Ignored' }) => {
    const styles = {
        'Mapped': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Partial': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Ignored': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status]}`}>{status}</span>
};

const OrgAuthenticationSecurity = () => {
    const [sessionTimeout, setSessionTimeout] = useState('7');
    const [ipAllowlist, setIpAllowlist] = useState('192.168.1.1/32\n10.8.8.0/24');

    const handleSaveChanges = () => {
        window.dispatchEvent(new CustomEvent('trackcodex-notification', {
            detail: { title: 'Settings Saved', message: 'Session security policies have been updated.', type: 'success' }
        }));
    };

    return (
        <div className="space-y-10 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-white">Authentication Security</h1>
                <p className="text-sm text-slate-400 mt-1">Manage your organization's SAML single sign-on configuration and session policies.</p>
            </div>

            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-start justify-between">
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-emerald-400 !text-2xl">verified</span>
                    <div>
                        <h3 className="font-bold text-white">SAML Single Sign-On is currently active</h3>
                        <p className="text-sm text-slate-400 mt-1">Your organization members are successfully authenticating via <span className="font-bold text-white">Okta Identity Provider</span>.</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                            <a href="#" className="text-primary hover:underline">View IdP Metadata</a>
                            <a href="#" className="text-primary hover:underline">Re-upload Certificate</a>
                        </div>
                    </div>
                </div>
                <button className="px-4 py-2 text-sm bg-gh-bg-secondary border border-gh-border rounded-lg text-white hover:border-slate-400 transition-colors">Edit Configuration</button>
            </div>
            
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-white">SAML Attributes</h2>
                    <span className="text-xs text-slate-500">Last synced: 2m ago</span>
                </div>
                <div className="bg-gh-bg-secondary border border-gh-border rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/20 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                                <th className="p-3">SAML Attribute Name</th>
                                <th className="p-3">TrackCodex Field</th>
                                <th className="p-3">Example Value</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gh-border text-sm">
                            <tr>
                                <td className="p-3 font-mono text-cyan-400">http://schemas.xmlsoap.org/.../emailaddress</td>
                                <td className="p-3 text-white font-semibold">Email Address</td>
                                <td className="p-3 font-mono text-slate-400">jane.doe@acme.com</td>
                                <td className="p-3"><StatusBadge status="Mapped" /></td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono text-cyan-400">http://schemas.xmlsoap.org/.../name</td>
                                <td className="p-3 text-white font-semibold">Full Name</td>
                                <td className="p-3 font-mono text-slate-400">Jane Doe</td>
                                <td className="p-3"><StatusBadge status="Mapped" /></td>
                            </tr>
                            <tr>
                                <td className="p-3 font-mono text-cyan-400">groups</td>
                                <td className="p-3 text-white font-semibold">Team Membership</td>
                                <td className="p-3 font-mono text-slate-400">["engineering", "admins"]</td>
                                <td className="p-3"><StatusBadge status="Partial" /></td>
                            </tr>
                             <tr>
                                <td className="p-3 font-mono text-cyan-400">cost_center_id</td>
                                <td className="p-3 text-slate-500 italic">Not configured</td>
                                <td className="p-3 font-mono text-slate-400">CC-9821</td>
                                <td className="p-3"><StatusBadge status="Ignored" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="text-right mt-3 text-sm">
                    <a href="#" className="text-primary hover:underline">Edit Mappings</a>
                </div>
            </section>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gh-border">
                <section>
                    <h2 className="font-bold text-white mb-4">Recovery Codes</h2>
                    <div className="p-5 bg-gh-bg-secondary border border-gh-border rounded-lg text-center">
                        <div className="size-12 rounded-full bg-gh-bg flex items-center justify-center mx-auto mb-3 text-slate-400 border border-gh-border">
                            <span className="material-symbols-outlined">emergency_home</span>
                        </div>
                        <h3 className="font-bold text-white mb-1">Emergency Access</h3>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">Recovery codes allow administrators to access the organization if your IdP becomes unavailable or is misconfigured. Keep these safe.</p>
                        <div className="flex gap-3">
                            <button className="flex-1 py-2 text-sm bg-gh-bg border border-gh-border rounded-lg text-white">View</button>
                            <button className="flex-1 py-2 text-sm bg-gh-bg border border-gh-border rounded-lg text-white">Download</button>
                        </div>
                    </div>
                </section>
                <section>
                    <h2 className="font-bold text-white mb-4">Session Security</h2>
                    <div className="p-5 bg-gh-bg-secondary border border-gh-border rounded-lg space-y-4">
                        <div>
                            <label className="text-sm font-bold text-white">Session Timeout</label>
                            <p className="text-xs text-slate-400 mb-2">Force re-authentication after a specified period of inactivity.</p>
                            <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white">
                                <option value="7">7 days</option>
                                <option value="14">14 days</option>
                                <option value="30">30 days</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-white">IP Allowlist</label>
                            <p className="text-xs text-slate-400 mb-2">Enter CIDR ranges or single IP addresses, one per line. Leave empty to allow all IPs.</p>
                            <textarea
                                value={ipAllowlist}
                                onChange={(e) => setIpAllowlist(e.target.value)}
                                className="w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white font-mono h-24 resize-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-3">
                            <button className="px-4 py-2 text-sm text-slate-300 hover:text-white">Discard</button>
                            <button onClick={handleSaveChanges} className="px-5 py-2 text-sm bg-primary rounded-lg text-white font-bold hover:bg-blue-600 transition-colors">Save Changes</button>
                        </div>
                    </div>
                </section>
            </div>

            <footer className="text-center text-xs text-slate-600 pt-8 border-t border-gh-border">
                © 2024 TrackCodex Inc.
            </footer>
        </div>
    );
};

export default OrgAuthenticationSecurity;
