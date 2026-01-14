import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
  isHighContrast: boolean;
  setIsHighContrast: (isHigh: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('trackcodex_theme_mode');
    return (saved as ThemeMode) || 'system';
  });

  const [isHighContrast, setIsHighContrastInternal] = useState<boolean>(() => {
    const saved = localStorage.getItem('trackcodex_high_contrast');
    return saved ? JSON.parse(saved) : false;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const setIsHighContrast = (isHigh: boolean) => {
    localStorage.setItem('trackcodex_high_contrast', JSON.stringify(isHigh));
    setIsHighContrastInternal(isHigh);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('trackcodex_theme_mode', mode);

    const updateTheme = () => {
      let theme: 'light' | 'dark' = 'dark';
      if (mode === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      } else {
        theme = mode;
      }

      setResolvedTheme(theme);
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();

    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      const listener = () => updateTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [mode, isHighContrast]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedTheme, isHighContrast, setIsHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};