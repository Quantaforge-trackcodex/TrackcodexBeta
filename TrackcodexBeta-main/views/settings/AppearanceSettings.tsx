import React from "react";
import {
  useTheme,
  AVAILABLE_THEMES,
  ThemeId,
} from "../../context/ThemeContext";
import styles from "./AppearanceSettings.module.css";

const ThemePreviewCard = ({
  item,
  isActive,
  onClick,
}: {
  item: (typeof AVAILABLE_THEMES)[0];
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="flex flex-col gap-2 group cursor-pointer" onClick={onClick}>
      <div
        className={`relative aspect-[1.6] rounded-md border-2 overflow-hidden transition-all ${isActive ? "border-primary" : "border-gh-border group-hover:border-slate-500"} ${styles.themePreview}`}
        style={{ "--theme-bg": item.colors.bg } as React.CSSProperties}
      >
        {/* Abstract UI representation */}
        <div
          className={`absolute top-3 left-3 right-3 h-2 rounded-full opacity-20 bg-current ${styles.themeText}`}
          style={{ "--theme-text": item.colors.text } as React.CSSProperties}
        ></div>
        <div
          className={`absolute top-8 left-3 w-1/4 h-2 rounded-full opacity-20 bg-current ${styles.themePrimary}`}
          style={
            { "--theme-primary": item.colors.primary } as React.CSSProperties
          }
        ></div>
        <div
          className={`absolute top-14 left-3 right-3 bottom-0 border-t border-l rounded-tl-md opacity-20 ${styles.themeButton}`}
          style={
            {
              "--theme-bg": item.colors.bg,
              borderColor: item.colors.border,
            } as React.CSSProperties
          }
        >
          <div
            className={`m-3 w-1/2 h-2 rounded-full opacity-20 bg-current shrink-0 ${styles.themeButtonIcon}`}
            style={
              { "--theme-primary": item.colors.primary } as React.CSSProperties
            }
          ></div>
        </div>

        {isActive && (
          <div className="absolute bottom-2 right-2 size-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-sm">
            <span className="material-symbols-outlined !text-[14px] font-bold">
              check
            </span>
          </div>
        )}

        {/* Beta badge if needed */}
        {item.id.includes("protanopia") && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-bold border border-green-500/20 rounded-full">
            Beta
          </span>
        )}
      </div>
      <div className="flex items-center justify-between px-1">
        <span
          className={`text-sm font-medium ${isActive ? "text-white" : "text-gh-text-secondary group-hover:text-slate-300"}`}
        >
          {item.name}
        </span>
      </div>
    </div>
  );
};

const AppearanceSettings = () => {
  const {
    themeMode,
    setThemeMode,
    activeThemeId,
    setActiveThemeId,
    preferredLightThemeId,
    setPreferredLightThemeId,
    preferredDarkThemeId,
    setPreferredDarkThemeId,
    isHighContrast,
    setIsHighContrast,
    fontTheme,
    setFontTheme,
    animationDensity,
    setAnimationDensity,
    tabSize,
    setTabSize,
    emojiSkinTone,
    setEmojiSkinTone,
    useMonospaceForMarkdown,
    setUseMonospaceForMarkdown,
  } = useTheme();

  const lightThemes = AVAILABLE_THEMES.filter((t) => t.type === "light");
  const darkThemes = AVAILABLE_THEMES.filter((t) => t.type === "dark");

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Theme preferences
        </h1>
        <p className="text-sm text-gh-text-secondary mt-1">
          Choose how TrackCodex looks to you. Select a single theme, or sync
          with your system and automatically switch between day and night
          themes. Selections are applied immediately and saved automatically.
        </p>
      </header>

      {/* Theme Mode Selector */}
      <section>
        <h2 className="text-sm font-bold text-white mb-2" id="theme-mode-label">
          Theme mode
        </h2>
        <div className="relative inline-block w-[300px]">
          <select
            value={themeMode}
            onChange={(e) => setThemeMode(e.target.value as any)}
            aria-labelledby="theme-mode-label"
            className="w-full appearance-none bg-gh-bg-secondary border border-gh-border text-white text-sm rounded-md px-3 py-2 pr-8 focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:bg-gh-border/50 transition-colors"
          >
            <option value="single">Single theme</option>
            <option value="system">Sync with system</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <span className="material-symbols-outlined !text-[18px]">
              expand_more
            </span>
          </span>
        </div>
        <p className="text-xs text-gh-text-secondary mt-2">
          {themeMode === "single"
            ? "TrackCodex will use your selected theme."
            : "TrackCodex will automatically switch based on your system settings."}
        </p>
      </section>

      {/* Theme Grids */}
      <section className="space-y-8">
        {/* Light Themes */}
        <div>
          <div className="grid grid-cols-3 gap-6">
            {lightThemes.map((theme) => (
              <ThemePreviewCard
                key={theme.id}
                item={theme}
                isActive={
                  themeMode === "single"
                    ? activeThemeId === theme.id
                    : preferredLightThemeId === theme.id
                }
                onClick={() => {
                  if (themeMode === "single") setActiveThemeId(theme.id);
                  else setPreferredLightThemeId(theme.id);
                }}
              />
            ))}
          </div>
        </div>

        {/* Dark Themes */}
        <div>
          <div className="grid grid-cols-3 gap-6">
            {darkThemes.map((theme) => (
              <ThemePreviewCard
                key={theme.id}
                item={theme}
                isActive={
                  themeMode === "single"
                    ? activeThemeId === theme.id
                    : preferredDarkThemeId === theme.id
                }
                onClick={() => {
                  if (themeMode === "single") setActiveThemeId(theme.id);
                  else setPreferredDarkThemeId(theme.id);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Settings (Contrast, Fonts, Animation) preserved below */}
      <div className="h-px bg-gh-border my-8"></div>

      {/* Contrast */}
      <section>
        <div className="flex items-center justify-between p-4 border border-gh-border rounded-md bg-gh-bg-secondary">
          <div>
            <h3 className="text-sm font-bold text-white">Increase contrast</h3>
            <p className="text-xs text-gh-text-secondary mt-0.5">
              Enable high contrast for light or dark mode (or both) based on
              your system settings
            </p>
          </div>
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`w-10 h-5 rounded-full relative transition-all ${isHighContrast ? "bg-primary" : "bg-slate-700"}`}
            aria-label="Toggle high contrast"
          >
            <div
              className={`absolute top-1 size-3 rounded-full transition-all ${isHighContrast ? "left-6 bg-primary-foreground" : "left-1 bg-white"}`}
            />
          </button>
        </div>
      </section>

      {/* Emoji Skin Tone Preference */}
      <section>
        <div className="flex items-center justify-between mb-3 pt-6">
          <h2 className="text-xl font-bold text-white">
            Emoji skin tone preference
          </h2>
          <span className="text-green-500 material-symbols-outlined !text-lg">
            check
          </span>
        </div>

        <p className="text-sm text-gh-text-secondary mb-4">
          Preferred default emoji skin tone
        </p>

        <div className="flex gap-6 items-center">
          {(
            [
              "default",
              "light",
              "medium-light",
              "medium",
              "medium-dark",
              "dark",
            ] as const
          ).map((tone, index) => {
            const emojis = ["👏", "👏🏻", "👏🏼", "👏🏽", "👏🏾", "👏🏿"];
            return (
              <label
                key={tone}
                className="cursor-pointer flex items-center gap-2 group"
              >
                <input
                  type="radio"
                  name="emoji-skin-tone"
                  value={tone}
                  checked={emojiSkinTone === tone}
                  onChange={() => setEmojiSkinTone(tone)}
                  className="text-primary focus:ring-primary bg-gh-bg border-gh-border mr-1"
                />
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {emojis[index]}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-gh-border my-8"></div>

      <section className="space-y-8">
        {/* Tab Size */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Tab size preference
          </h2>
          <p className="text-sm text-gh-text-secondary mb-2">
            Choose the number of spaces a tab is equal to when rendering code
          </p>
          <div className="relative inline-block">
            <select
              value={tabSize}
              aria-label="Tab Size"
              onChange={(e) => setTabSize(parseInt(e.target.value, 10))}
              className="appearance-none bg-gh-bg-secondary border border-gh-border text-white text-sm rounded-md px-3 py-1.5 pr-8 focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:bg-gh-border/50 transition-colors"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 (Default)</option>
              <option value={8}>8 spaces</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <span className="material-symbols-outlined !text-[18px]">
                expand_more
              </span>
            </span>
          </div>
        </div>

        {/* Markdown Font */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Markdown editor font preference
          </h2>
          <p className="text-sm text-gh-text-secondary mb-3">
            Font preference for plain text editors that support Markdown styling
            (e.g. pull request and issue descriptions, comments.)
          </p>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={useMonospaceForMarkdown}
              onChange={(e) => setUseMonospaceForMarkdown(e.target.checked)}
              className="rounded text-primary focus:ring-primary bg-gh-bg border-gh-border"
            />
            <span className="text-sm text-white group-hover:text-primary transition-colors">
              Use a fixed-width (monospace) font when editing Markdown
            </span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default AppearanceSettings;
