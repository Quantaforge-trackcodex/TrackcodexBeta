import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "single" | "system";
export type ThemeId =
  | "light_default"
  | "light_high_contrast"
  | "dark_default"
  | "dark_dimmed"
  | "dark_high_contrast";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  type: "light" | "dark";
  colors: {
    bg: string; // --color-canvas-default
    secondary: string; // --color-canvas-subtle
    tertiary: string; // --color-canvas-inset or custom
    text: string; // --color-fg-default
    textSecondary: string; // --color-fg-subtle
    border: string; // --color-border-default
    primary: string; // --color-accent-fg
  };
}

export const AVAILABLE_THEMES: ThemeDefinition[] = [
  {
    id: "light_default",
    name: "Light default",
    type: "light",
    colors: {
      bg: "#ffffff",
      secondary: "#f6f8fa",
      tertiary: "#efefef",
      text: "#24292f",
      textSecondary: "#57606a",
      border: "#d0d7de",
      primary: "#0969da",
    },
  },
  {
    id: "light_high_contrast",
    name: "Light high contrast",
    type: "light",
    colors: {
      bg: "#ffffff",
      secondary: "#ffffff",
      tertiary: "#efefef",
      text: "#000000",
      textSecondary: "#333333",
      border: "#000000",
      primary: "#0969da",
    },
  },
  {
    id: "dark_default",
    name: "Dark default",
    type: "dark",
    colors: {
      bg: "#0B0D10",
      secondary: "#161B22",
      tertiary: "#141820",
      text: "#E6EDF3",
      textSecondary: "#A6B0BF",
      border: "rgba(255, 255, 255, 0.08)",
      primary: "#F0F6FC",
    },
  },
  {
    id: "dark_dimmed",
    name: "Dark dimmed",
    type: "dark",
    colors: {
      bg: "#161b22",
      secondary: "#22272e",
      tertiary: "#2d333b",
      text: "#adbac7",
      textSecondary: "#768390",
      border: "#444c56",
      primary: "#539bf5",
    },
  },
  {
    id: "dark_high_contrast",
    name: "Dark high contrast",
    type: "dark",
    colors: {
      bg: "#0a0a0a",
      secondary: "#010409",
      tertiary: "#161b22",
      text: "#f0f6fc",
      textSecondary: "#c9d1d9",
      border: "#f0f6fc",
      primary: "#409eff",
    },
  },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  activeThemeId: ThemeId;
  setActiveThemeId: (id: ThemeId) => void; // For 'single' mode
  preferredLightThemeId: ThemeId;
  setPreferredLightThemeId: (id: ThemeId) => void;
  preferredDarkThemeId: ThemeId;
  setPreferredDarkThemeId: (id: ThemeId) => void;
  resolvedTheme: ThemeDefinition;

  // Legacy/Other props
  isHighContrast: boolean;
  setIsHighContrast: (isHigh: boolean) => void;
  animationDensity: "standard" | "fast" | "none";
  setAnimationDensity: (density: "standard" | "fast" | "none") => void;
  tabSize: number;
  setTabSize: (size: number) => void;
  fontTheme: "inter" | "system" | "mono";
  setFontTheme: (font: "inter" | "system" | "mono") => void;
  emojiSkinTone: string;
  setEmojiSkinTone: (tone: string) => void;
  useMonospaceForMarkdown: boolean;
  setUseMonospaceForMarkdown: (useMono: boolean) => void;
  isMotionReduced: boolean;
  setIsMotionReduced: (isReduced: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1. Theme Mode: 'single' or 'system'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("tc_theme_mode") as ThemeMode) || "single";
  });

  // 2. Preferences
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(() => {
    return (
      (localStorage.getItem("tc_active_theme") as ThemeId) || "dark_default"
    );
  });
  const [preferredLightThemeId, setPreferredLightThemeId] = useState<ThemeId>(
    () => {
      return (
        (localStorage.getItem("tc_pref_light") as ThemeId) || "light_default"
      );
    },
  );
  const [preferredDarkThemeId, setPreferredDarkThemeId] = useState<ThemeId>(
    () => {
      return (
        (localStorage.getItem("tc_pref_dark") as ThemeId) || "dark_default"
      );
    },
  );

  // 3. Other Settings
  const [fontTheme, setFontTheme] = useState<"inter" | "system" | "mono">(
    "inter",
  );
  const [animationDensity, setAnimationDensity] = useState<
    "standard" | "fast" | "none"
  >("standard");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isMotionReduced, setIsMotionReduced] = useState(false);
  const [tabSize, setTabSize] = useState<number>(() => {
    return parseInt(localStorage.getItem("tc_tab_size") || "4", 10);
  });

  const updateTabSize = (size: number) => {
    localStorage.setItem("tc_tab_size", size.toString());
    setTabSize(size);
    document.documentElement.style.setProperty("--tab-size", size.toString());
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--tab-size",
      tabSize.toString(),
    );
  }, [tabSize]);

  // 4. Persistence Helpers
  useEffect(
    () => localStorage.setItem("tc_theme_mode", themeMode),
    [themeMode],
  );
  useEffect(
    () => localStorage.setItem("tc_active_theme", activeThemeId),
    [activeThemeId],
  );
  useEffect(
    () => localStorage.setItem("tc_pref_light", preferredLightThemeId),
    [preferredLightThemeId],
  );
  useEffect(
    () => localStorage.setItem("tc_pref_dark", preferredDarkThemeId),
    [preferredDarkThemeId],
  );

  // 5. Resolution Logic
  const getResolvedThemeId = (): ThemeId => {
    if (themeMode === "single") return activeThemeId;

    // System logic
    const systemIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return systemIsDark ? preferredDarkThemeId : preferredLightThemeId;
  };

  const resolvedThemeId = getResolvedThemeId();
  const resolvedTheme =
    AVAILABLE_THEMES.find((t) => t.id === resolvedThemeId) ||
    AVAILABLE_THEMES[2];

  // 6. Apply to DOM
  useEffect(() => {
    const root = document.documentElement;

    // 1. Reset specific classes
    root.classList.remove("dark", "light");

    // 2. Apply base dark class if dark type (for Tailwind 'dark:' prefix support)
    if (resolvedTheme.type === "dark") {
      root.classList.add("dark");
    }

    // 3. Apply CSS Variables directly to :root
    // In a real app with Tailwind, we might map these to custom properties defined in tailwind.config
    // For now, we'll set standard properties that the app hopefully uses, or simple overrides
    root.style.setProperty("--gh-bg", resolvedTheme.colors.bg);
    root.style.setProperty("--gh-bg-secondary", resolvedTheme.colors.secondary);
    root.style.setProperty("--gh-bg-tertiary", resolvedTheme.colors.tertiary);
    root.style.setProperty("--gh-text", resolvedTheme.colors.text);
    root.style.setProperty(
      "--gh-text-secondary",
      resolvedTheme.colors.textSecondary,
    );
    root.style.setProperty("--gh-border", resolvedTheme.colors.border);
    root.style.setProperty("--gh-primary", resolvedTheme.colors.primary);
    // Rough hack for background if the app uses utility classes mostly
    // We can't easily override tailwind 'bg-slate-900' unless we use important or CSS vars in config.
    // Assuming the app has *some* generic background set, or we force it on body.
    document.body.style.backgroundColor = resolvedTheme.colors.bg;
    document.body.style.color = resolvedTheme.colors.text;
  }, [resolvedTheme]);

  const [emojiSkinTone, setEmojiSkinTone] = useState<string>(() => {
    return localStorage.getItem("tc_emoji_skin_tone") || "default";
  });

  const [useMonospaceForMarkdown, setUseMonospaceForMarkdown] =
    useState<boolean>(() => {
      return localStorage.getItem("tc_mono_md") === "true";
    });

  const updateEmojiSkinTone = (tone: string) => {
    localStorage.setItem("tc_emoji_skin_tone", tone);
    setEmojiSkinTone(tone);
  };

  const updateUseMonospaceForMarkdown = (useMono: boolean) => {
    localStorage.setItem("tc_mono_md", String(useMono));
    setUseMonospaceForMarkdown(useMono);
  };

  // Listen for system changes
  useEffect(() => {
    if (themeMode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      // Trigger re-render by toggling a dummy state or just trusting React's nature?
      // Actually we need state to force re-calc of getResolvedThemeId if it wasn't in useEffect dep.
      // But getResolvedThemeId is called in render body. We need to force update.
      setThemeMode((prev) => prev); // Cheap force update
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        activeThemeId,
        setActiveThemeId,
        preferredLightThemeId,
        setPreferredLightThemeId,
        preferredDarkThemeId,
        setPreferredDarkThemeId,
        resolvedTheme,
        // Legacy items
        isHighContrast,
        setIsHighContrast,
        animationDensity,
        setAnimationDensity,
        fontTheme,
        setFontTheme,
        tabSize,
        setTabSize: updateTabSize,
        emojiSkinTone,
        setEmojiSkinTone: updateEmojiSkinTone,
        useMonospaceForMarkdown,
        setUseMonospaceForMarkdown: updateUseMonospaceForMarkdown,
        isMotionReduced,
        setIsMotionReduced,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
