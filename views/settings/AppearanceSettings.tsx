import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeCard = ({ type, active, onClick }: { type: 'light' | 'dark', active: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex-1 min-h-[160px] rounded-xl border-2 cursor-pointer transition-all flex flex-col overflow-hidden relative group ${
      active ? 'border-primary ring-2 ring-primary/20' : 'border-gh-border hover:border-slate-500'
    }`}
  >
    <div className={`flex-1 p-4 flex flex-col gap-2 ${type === 'light' ? 'bg-[#f6f8fa]' : 'bg-[#0d1117]'}`}>
       <div className="flex gap-1.5">
          <div className={`w-8 h-1.5 rounded-full ${type === 'light' ? 'bg-slate-300' : 'bg-slate-700'}`} />
          <div className={`w-12 h-1.5 rounded-full ${type === 'light' ? 'bg-slate-200' : 'bg-slate-800'}`} />
       </div>
       <div className={`w-full h-12 rounded-md mt-2 ${type === 'light' ? 'bg-white border border-slate-200' : 'bg-[#161b22] border border-[#30363d]'} flex items-end p-2`}>
          <div className="w-2/3 h-2 rounded-sm bg-emerald-500" />
       </div>
       <div className="flex justify-end gap-1 mt-auto">
          <div className="size-2 rounded-sm bg-rose-500" />
          <div className="size-2 rounded-sm bg-emerald-500" />
       </div>
    </div>
    <div className={`p-3 border-t text-[12px] font-bold flex items-center justify-center ${type === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#161b22] border-[#30363d] text-white'}`}>
      {type === 'dark' ? 'Dark default' : 'Light default'}
    </div>
    {active && (
      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white">
          <span className="material-symbols-outlined filled">check</span>
        </div>
      </div>
    )}
  </div>
);

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-primary' : 'bg-[#30363d]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

const AppearanceSettings = () => {
  const { mode, setMode, resolvedTheme, isHighContrast, setIsHighContrast } = useTheme();

  return (
    <div className="space-y-10">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Appearance</h1>
        <p className="text-sm text-gh-text-secondary mt-1 leading-relaxed">
          Choose how TrackCodex looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Theme mode</h3>
          <div className="relative w-64">
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full bg-gh-bg-secondary border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="system">Sync with system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">unfold_more</span>
          </div>
          <p className="text-xs text-gh-text-secondary mt-2">TrackCodex theme will match your system active settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-xs font-bold text-gh-text-secondary uppercase tracking-widest">
               <span className="material-symbols-outlined !text-[16px]">light_mode</span>
               Light Theme
             </div>
             <p className="text-xs text-gh-text-secondary">This theme will be active when your system is set to "light mode"</p>
             <ThemeCard type="light" active={resolvedTheme === 'light'} onClick={() => setMode('light')} />
          </div>

          <div className="space-y-3">
             <div className="flex items-center gap-2 text-xs font-bold text-gh-text-secondary uppercase tracking-widest">
               <span className="material-symbols-outlined !text-[16px]">dark_mode</span>
               Dark Theme
             </div>
             <p className="text-xs text-gh-text-secondary">This theme will be active when your system is set to "dark mode"</p>
             <ThemeCard type="dark" active={resolvedTheme === 'dark'} onClick={() => setMode('dark')} />
          </div>
        </div>
      </section>

      <section className="pt-8 border-t border-gh-border space-y-6">
        <h3 className="text-lg font-bold text-white">Contrast</h3>
        <div className="flex items-center justify-between group">
           <div>
              <p className="text-sm font-bold text-white">Increase contrast</p>
              <p className="text-xs text-gh-text-secondary">Make UI elements stand out more using higher contrast colors.</p>
           </div>
           <ToggleSwitch enabled={isHighContrast} onChange={() => setIsHighContrast(!isHighContrast)} />
        </div>
      </section>
    </div>
  );
};

export default AppearanceSettings;