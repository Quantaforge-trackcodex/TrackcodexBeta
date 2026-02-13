import React, { useState } from 'react';
import AddEnvVarModal from '../../../components/organizations/AddEnvVarModal';

interface EnvVar {
    key: string;
    value: string;
    environment: 'Production' | 'Staging' | 'Development';
    updated: string;
    isSecret: boolean;
}

const OrgEnvironments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variables, setVariables] = useState<EnvVar[]>([
        { key: 'STRIPE_SECRET_KEY', value: 'sk_test_****************', environment: 'Production', updated: '2m ago', isSecret: true },
        { key: 'NEXT_PUBLIC_API_URL', value: 'https://api.dev.trackcodex.com', environment: 'Staging', updated: '1d ago', isSecret: false },
        { key: 'REDIS_CACHE_URL', value: 'redis://****************', environment: 'Production', updated: '5d ago', isSecret: true },
        { key: 'AWS_ACCESS_KEY_ID', value: 'AKIA****************', environment: 'Development', updated: '1w ago', isSecret: true },
    ]);

    const handleAddVariable = (newVar: Omit<EnvVar, 'updated'>) => {
        setVariables(prev => [{ ...newVar, updated: 'Just now' }, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-5xl">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Environment Variables</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage secrets and configuration for your workspace environments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm bg-gh-bg-secondary border border-gh-border rounded-lg text-white flex items-center gap-2"><span className="material-symbols-outlined !text-base">upload</span> Import .env</button>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 text-sm bg-primary rounded-lg text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"><span className="material-symbols-outlined !text-base">add</span> New Variable</button>
                </div>
            </header>

            <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-sm">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-base">search</span>
                    <input placeholder="Filter variables by key..." className="w-full bg-gh-bg-secondary border border-gh-border rounded-lg pl-9 pr-4 py-2 text-sm text-white" />
                </div>
                <div className="flex items-center gap-1 p-1 bg-gh-bg-secondary border border-gh-border rounded-lg">
                    <button className="size-7 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined !text-lg">grid_view</span></button>
                    <button className="size-7 flex items-center justify-center bg-white/10 text-white rounded"><span className="material-symbols-outlined !text-lg">list</span></button>
                </div>
            </div>

            <div className="bg-gh-bg-secondary border border-gh-border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20">
                        <tr className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                            <th className="p-4">Key</th>
                            <th className="p-4">Value</th>
                            <th className="p-4">Environment</th>
                            <th className="p-4">Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gh-border">
                        {variables.map(v => (
                            <tr key={v.key} className="text-sm text-slate-300 hover:bg-white/5">
                                <td className="p-4 font-mono flex items-center gap-2"><span className="material-symbols-outlined !text-base text-slate-500">key</span>{v.key}</td>
                                <td className="p-4 font-mono">{v.isSecret ? '••••••••••••••••' : v.value}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                        v.environment === 'Production' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                        v.environment === 'Staging' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                        'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                    }`}>{v.environment}</span>
                                </td>
                                <td className="p-4 text-slate-500">{v.updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-8 p-5 bg-blue-500/5 border border-blue-500/20 rounded-lg flex items-start gap-4">
                <span className="material-symbols-outlined text-blue-400">lock</span>
                <div>
                    <h4 className="font-bold text-white text-sm">Encryption Standard</h4>
                    <p className="text-xs text-slate-400 mt-1">Environment variables are encrypted at rest using AES-256. They are only decrypted by the build system during deployment or runtime. <a href="#" className="text-primary hover:underline">Learn more about our security model.</a></p>
                </div>
            </div>

            {isModalOpen && <AddEnvVarModal onClose={() => setIsModalOpen(false)} onAdd={handleAddVariable} />}
        </div>
    );
};

export default OrgEnvironments;
