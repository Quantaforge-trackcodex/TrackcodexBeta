import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AppearanceSettings = () => {
  const { mode, setMode, isHighContrast, setIsHighContrast } = useTheme();

  return (
    <div className="space-y-8">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Appearance</h1>
        <p className="text-sm text-gh-text-secondary mt-1">
          Customize the look and feel of your TrackCodex interface.
        </p>
      </header>
      
      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">Theme</h2>
        <div className="space-y-4">
          <p className="text-sm text-gh-text-secondary">Select your preferred color theme.</p>
          <div className="flex items-center gap-4">
            {['light', 'dark', 'system'].map((themeMode) => (
              <label key={themeMode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={themeMode}
                  checked={mode === themeMode}
                  onChange={() => setMode(themeMode as any)}
                  className="form-radio bg-gh-bg border-gh-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-white capitalize">{themeMode}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">Contrast</h2>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white text-sm">High Contrast Mode</h4>
            <p className="text-xs text-gh-text-secondary mt-1">Increase UI contrast for better visibility.</p>
          </div>
          <button 
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`w-10 h-5 rounded-full relative transition-all ${isHighContrast ? 'bg-primary' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 size-3 bg-white rounded-full transition-all ${isHighContrast ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AppearanceSettings;