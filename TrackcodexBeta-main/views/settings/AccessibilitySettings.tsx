import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ToggleSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gh-bg ${enabled ? "bg-primary" : "bg-gh-border"
      }`}
    aria-checked={String(enabled)}
    role="switch"
    aria-label="Toggle Setting"
  >
    <span
      className={`pointer-events-none inline-block size-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-5 bg-primary-foreground" : "translate-x-0 bg-white"
        }`}
    />
  </button>
);

const PreferenceRow = ({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => (
  <div className="p-4 bg-gh-bg-secondary border border-gh-border rounded-lg flex items-center justify-between">
    <div>
      <h4 className="font-bold text-white text-sm">{title}</h4>
      <p className="text-xs text-gh-text-secondary mt-1">{description}</p>
    </div>
    <ToggleSwitch enabled={enabled} onChange={onChange} />
  </div>
);

// FIX: Changed component to React.FC to correctly handle the 'key' prop when used in a list.
const ShortcutKey: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <kbd className="px-2 py-1 text-xs font-mono font-semibold text-gh-text-secondary bg-gh-bg border border-gh-border rounded-md shadow-sm">
    {children}
  </kbd>
);

const AccessibilitySettings = () => {
  const {
    isHighContrast,
    setIsHighContrast,
    isMotionReduced,
    setIsMotionReduced,
  } = useTheme();

  const [enableShortcuts, setEnableShortcuts] = useState(() =>
    localStorage.getItem("a11y_enableShortcuts")
      ? JSON.parse(localStorage.getItem("a11y_enableShortcuts")!)
      : true,
  );
  const [announceUpdates, setAnnounceUpdates] = useState(() =>
    localStorage.getItem("a11y_announceUpdates")
      ? JSON.parse(localStorage.getItem("a11y_announceUpdates")!)
      : false,
  );

  const [initialState, setInitialState] = useState({
    enableShortcuts,
    highContrast: isHighContrast,
    reduceMotion: isMotionReduced,
    announceUpdates,
  });

  const hasChanges =
    enableShortcuts !== initialState.enableShortcuts ||
    isHighContrast !== initialState.highContrast ||
    isMotionReduced !== initialState.reduceMotion ||
    announceUpdates !== initialState.announceUpdates;

  const handleSave = () => {
    localStorage.setItem(
      "a11y_enableShortcuts",
      JSON.stringify(enableShortcuts),
    );
    localStorage.setItem(
      "a11y_announceUpdates",
      JSON.stringify(announceUpdates),
    );

    // Context handles its own storage
    setIsHighContrast(isHighContrast);
    setIsMotionReduced(isMotionReduced);

    setInitialState({
      enableShortcuts,
      highContrast: isHighContrast,
      reduceMotion: isMotionReduced,
      announceUpdates,
    });

    window.dispatchEvent(
      new CustomEvent("trackcodex-notification", {
        detail: {
          title: "Preferences Saved",
          message: "Your accessibility settings have been updated.",
          type: "success",
        },
      }),
    );
  };

  const handleDiscard = () => {
    setEnableShortcuts(initialState.enableShortcuts);
    setIsHighContrast(initialState.highContrast);
    setIsMotionReduced(initialState.reduceMotion);
    setAnnounceUpdates(initialState.announceUpdates);
  };

  return (
    <div className="space-y-12">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Accessibility & Shortcuts
        </h1>
        <p className="text-sm text-gh-text-secondary mt-1 max-w-2xl">
          Customize how you interact with TrackCodex to fit your needs.
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
          <a
            href="#"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all shortcuts
            <span className="material-symbols-outlined !text-base">
              open_in_new
            </span>
          </a>
        </div>
        <div className="space-y-4">
          <PreferenceRow
            title="Enable keyboard shortcuts"
            description="Use shortcuts to perform common actions across the workspace efficiently."
            enabled={enableShortcuts}
            onChange={setEnableShortcuts}
          />
          <div className="bg-gh-bg-secondary border border-gh-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gh-bg">
                <tr>
                  <th className="px-4 py-2 text-xs font-bold text-gh-text-secondary uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-2 text-xs font-bold text-gh-text-secondary uppercase tracking-wider text-right">
                    Key Combination
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gh-border">
                {[
                  {
                    action: "Focus search bar",
                    keys: [<ShortcutKey key="s">s</ShortcutKey>],
                  },
                  {
                    action: "Go to Pull Requests",
                    keys: [
                      <ShortcutKey key="g">g</ShortcutKey>,
                      "+",
                      <ShortcutKey key="p">p</ShortcutKey>,
                    ],
                  },
                  {
                    action: "Global site search",
                    keys: [<ShortcutKey key="slash">/</ShortcutKey>],
                  },
                  {
                    action: "Open Command Palette",
                    keys: [
                      <ShortcutKey key="cmd">⌘</ShortcutKey>,
                      "+",
                      <ShortcutKey key="k">k</ShortcutKey>,
                    ],
                  },
                ].map((item) => (
                  <tr key={item.action}>
                    <td className="px-4 py-3 text-gh-text">{item.action}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.keys}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-4">
          Accessibility Preferences
        </h2>
        <div className="space-y-4">
          <PreferenceRow
            title="High contrast mode"
            description="Increases the contrast of UI elements for better visibility."
            enabled={isHighContrast}
            onChange={setIsHighContrast}
          />
          <PreferenceRow
            title="Reduce motion"
            description="Disables non-essential animations and page transitions."
            enabled={isMotionReduced}
            onChange={setIsMotionReduced}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-4">
          Screen Reader optimization
        </h2>
        <div className="space-y-4">
          <PreferenceRow
            title="Announce dynamic updates"
            description="Use ARIA-live regions to announce status updates and background tasks."
            enabled={announceUpdates}
            onChange={setAnnounceUpdates}
          />
        </div>
      </section>

      {hasChanges && (
        <footer className="pt-8 border-t border-gh-border flex justify-end items-center gap-4 animate-in fade-in">
          <button
            onClick={handleDiscard}
            className="text-sm font-bold text-gh-text-secondary hover:underline"
          >
            Discard changes
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110"
          >
            Save preferences
          </button>
        </footer>
      )}
    </div>
  );
};

export default AccessibilitySettings;
