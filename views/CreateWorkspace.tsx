
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-primary' : 'bg-slate-700'
    }`}
  >
    <span
      className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const CreateWorkspaceView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(3); // Defaulting to last step for view context matching
  const [type, setType] = useState('team');
  const [isCreating, setIsCreating] = useState(false);
  
  // Settings state for Section 4
  const [settings, setSettings] = useState({
    defaultEnvs: true,
    forgeAI: true,
    css: true,
    collaboration: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const steps = ['Type', 'Details', 'Setup', 'Defaults'];

  const handleCreate = () => {
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/workspace/123');
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-10 font-display">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Create New Workspace</h1>
          <p className="text-slate-500 font-medium">Set up your development command center with enterprise-grade defaults.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-16 relative px-20">
          <div className="absolute left-20 right-20 top-[11px] h-0.5 bg-[#30363d] -z-10"></div>
          {steps.map((s, i) => (
            <div 
              key={s} 
              onClick={() => !isCreating && setStep(i)}
              className="flex flex-col items-center gap-2 relative bg-[#0d1117] px-4 cursor-pointer group"
            >
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                i <= step ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(19,91,236,0.4)]' : 'border-[#30363d] text-slate-500 group-hover:border-slate-500'
              }`}>
                {i < step ? <span className="material-symbols-outlined !text-[14px]">check</span> : <span className="text-[10px] font-bold">{i + 1}</span>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${i <= step ? 'text-white' : 'text-slate-600'}`}>{s} Selection</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-12">
            {/* Section 1 */}
            <section className={step >= 0 ? 'opacity-100' : 'opacity-30 pointer-events-none'}>
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">1: Workspace Type Selection</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'personal', label: 'Personal Workspace', icon: 'person', desc: 'Solo developers. Private.' },
                  { id: 'team', label: 'Team Workspace', icon: 'groups', desc: 'Organizations. RBAC enabled.' },
                  { id: 'community', label: 'Community Workspace', icon: 'public', desc: 'Public learning sessions.' }
                ].map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group relative h-full ${
                      type === t.id ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(19,91,236,0.05)]' : 'border-[#30363d] bg-white/[0.01] hover:border-slate-600'
                    }`}
                  >
                    <div className={`size-10 rounded-full flex items-center justify-center mb-4 transition-colors ${type === t.id ? 'bg-primary text-white' : 'bg-[#161b22] text-slate-500'}`}>
                      <span className="material-symbols-outlined !text-[20px]">{t.icon}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-2">{t.label}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{t.desc}</p>
                    {type === t.id && (
                      <div className="absolute top-2 right-2 size-4 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                        <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section className={step >= 1 ? 'opacity-100' : 'opacity-30 pointer-events-none'}>
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">2: Workspace Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 tracking-widest">Workspace Name</label>
                  <input className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white outline-none transition-all" placeholder='e.g., "Phoenix Core"' />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 tracking-widest">Workspace Visibility</label>
                  <select className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white outline-none appearance-none">
                    <option>Private</option>
                    <option>Public</option>
                    <option>Restricted</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 tracking-widest">Optional Description</label>
                  <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white h-20 resize-none outline-none" placeholder="Context for contributors..." />
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className={step >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}>
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">3: Project & Repository Setup</h2>
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-6 rounded-xl border-2 border-[#30363d] bg-white/[0.01] hover:border-primary cursor-pointer flex flex-col items-center justify-center group transition-all h-full">
                    <span className="material-symbols-outlined !text-[32px] text-slate-600 group-hover:text-primary mb-4">folder_open</span>
                    <span className="text-[11px] font-bold text-white">Create Empty</span>
                 </div>
                 <div className="p-5 rounded-xl border-2 border-primary bg-primary/5 flex flex-col relative h-full">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Import Git</span>
                       <span className="material-symbols-outlined !text-[16px] text-primary">expand_more</span>
                    </div>
                    <div className="flex gap-2 mb-4">
                       <div className="size-8 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer"><span className="material-symbols-outlined text-green-500 text-sm">terminal</span></div>
                       <div className="size-8 rounded bg-white/20 border border-white/30 flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-white text-sm">hub</span></div>
                       <div className="size-8 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer"><span className="material-symbols-outlined text-orange-500 text-sm">rocket</span></div>
                    </div>
                    <input className="w-full bg-black/40 border border-[#30363d] rounded p-2 text-[10px] text-white focus:ring-1 focus:ring-primary outline-none" placeholder="Repository URL" />
                 </div>
                 <div className="p-5 rounded-xl border-2 border-[#30363d] bg-white/[0.01] flex flex-col h-full">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Templates</span>
                    <div className="grid grid-cols-2 gap-2 flex-1">
                       <div className="p-2 border border-primary/40 bg-primary/10 rounded flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-primary/20 transition-all">
                          <span className="material-symbols-outlined !text-[18px] text-primary">language</span>
                          <span className="text-[8px] font-bold uppercase text-white">Web</span>
                       </div>
                       <div className="p-2 border border-[#30363d] bg-white/5 rounded flex flex-col items-center justify-center gap-1 hover:border-slate-500 cursor-pointer transition-all">
                          <span className="material-symbols-outlined !text-[18px] text-slate-500">api</span>
                          <span className="text-[8px] font-bold uppercase text-slate-400">API</span>
                       </div>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            {/* Section 4: Environment & Security Defaults (Matches Screenshot) */}
            <section className={step >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}>
              <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">4: ENVIRONMENT & SECURITY DEFAULTS</h2>
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-2xl">
                 <div className="flex items-center justify-between group">
                    <span className="text-sm text-slate-200 font-medium">Default environments (Dev / Staging / Prod)</span>
                    <ToggleSwitch 
                      enabled={settings.defaultEnvs} 
                      onChange={() => toggleSetting('defaultEnvs')} 
                    />
                 </div>
                 <div className="flex items-center justify-between group">
                    <span className="text-sm text-slate-200 font-medium">Enable ForgeAI assistance</span>
                    <ToggleSwitch 
                      enabled={settings.forgeAI} 
                      onChange={() => toggleSetting('forgeAI')} 
                    />
                 </div>
                 <div className="flex items-center justify-between group">
                    <span className="text-sm text-slate-200 font-medium">Enable CSS (Code Security System)</span>
                    <ToggleSwitch 
                      enabled={settings.css} 
                      onChange={() => toggleSetting('css')} 
                    />
                 </div>
                 <div className="flex items-center justify-between group">
                    <span className="text-sm text-slate-200 font-medium">Enable real-time collaboration</span>
                    <ToggleSwitch 
                      enabled={settings.collaboration} 
                      onChange={() => toggleSetting('collaboration')} 
                    />
                 </div>
                 
                 <div className="pt-6 border-t border-[#30363d]">
                    <p className="text-[11px] text-slate-500 font-medium">Encrypted at rest and in transit. Role-based access control.</p>
                 </div>
              </div>
            </section>

            {/* Final Action Area */}
            <div className="flex flex-col items-center gap-6 pt-12 border-t border-[#30363d]">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="bg-primary hover:bg-blue-600 text-white px-12 py-3.5 rounded-xl font-black uppercase tracking-[0.1em] text-xs transition-all shadow-[0_10px_30px_rgba(19,91,236,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95"
                  >
                    {isCreating ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        Initializing...
                      </>
                    ) : (
                      'Create Workspace'
                    )}
                  </button>
                  <button 
                    disabled={isCreating}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs transition-all border border-[#30363d] disabled:opacity-30" 
                    onClick={() => navigate('/workspaces')}
                  >
                    Cancel
                  </button>
               </div>
               
               {isCreating && (
                 <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary">
                       <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                       Allocating cloud resources
                    </div>
                    <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                       <div className="h-full bg-primary animate-[shimmer_2s_infinite_linear] w-[60%]"></div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        <footer className="mt-32 text-center pb-12">
           <div className="flex items-center justify-center gap-2 mb-2 opacity-40">
              <span className="material-symbols-outlined text-slate-500 !text-sm">hub</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">TrackCodex Infrastructure</span>
           </div>
           <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">Enterprise Instance ID: QFC-9023-SEC</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateWorkspaceView;
