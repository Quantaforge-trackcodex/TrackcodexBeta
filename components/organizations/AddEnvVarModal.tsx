import React, { useState } from 'react';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (e: boolean) => void }) => (
    <button type="button" onClick={() => onChange(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-slate-600'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const AddEnvVarModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: (v: any) => void }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [mask, setMask] = useState(false);
    const [environment, setEnvironment] = useState('Production');
    const [isSecret, setIsSecret] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ key: name, value, environment, isSecret });
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="bg-[#1c1f26] border border-[#30363d] w-full max-w-lg rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex items-center justify-between border-b border-gh-border">
                    <h2 className="font-bold text-white">Add new variable</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-1">Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-white" placeholder="DB_HOST" />
                            <p className="text-xs text-slate-500 mt-1">Must consist of A-Z, 0-9, and underscores.</p>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-slate-300 block mb-1">Value</label>
                            <textarea value={value} onChange={e => setValue(e.target.value)} className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-white h-24 font-mono resize-none" placeholder="postgres://user:pass@..." />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" checked={mask} onChange={e => setMask(e.target.checked)} className="form-checkbox bg-gh-bg border-gh-border text-primary" />
                            <label className="text-sm text-slate-300">Mask value in logs</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-1">Environment</label>
                                <select value={environment} onChange={e => setEnvironment(e.target.value)} className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-white">
                                    <option>Production</option>
                                    <option>Staging</option>
                                    <option>Development</option>
                                </select>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-slate-300 block mb-1">Secret</label>
                                <div className="flex items-center gap-3 p-2 bg-gh-bg border border-gh-border rounded-md">
                                    <span className="text-sm text-slate-400">Encrypt value</span>
                                    <div className="ml-auto">
                                      <Toggle enabled={isSecret} onChange={setIsSecret} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="p-4 bg-[#161b22] border-t border-gh-border flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-700 rounded-lg">Cancel</button>
                        <button type="submit" className="px-5 py-2 text-sm bg-primary rounded-lg text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"><span className="material-symbols-outlined !text-base">add</span> Add Variable</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AddEnvVarModal;
