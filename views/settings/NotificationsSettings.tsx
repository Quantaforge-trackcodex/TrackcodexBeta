import React, { useState } from "react";

// A simple custom checkbox component to match the mockup's style
const CustomCheckbox = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}) => (
  <label className="flex items-start gap-4 cursor-pointer group">
    <div className="mt-1 flex-shrink-0">
      <div
        className={`size-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-[#a855f7] border-[#a855f7]" : "bg-gh-bg-secondary border-gh-border group-hover:border-slate-500"}`}
      >
        {checked && (
          <span className="material-symbols-outlined !text-[14px] text-white font-black">
            check
          </span>
        )}
      </div>
    </div>
    {label && (
      <div>
        <p className="font-bold text-white text-sm">{label}</p>
        <p className="text-xs text-gh-text-secondary mt-1">{description}</p>
      </div>
    )}
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

const defaultSettings = {
  watchRepos: true,
  watchTeams: true,
  primaryEmail: "developer@trackcodex.io",
  marketingEmails: false,
  notifications: {
    participating: { web: true, email: false },
    mentions: { web: true, email: true },
    failedActions: { web: true, email: true },
    securityAlerts: { web: true, email: true },
  },
};

const NotificationsSettings = () => {
  const [settings, setSettings] = useState<typeof defaultSettings>(() => {
    try {
      const saved = localStorage.getItem("trackcodex_notifications");
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (e) {
      console.error(
        "Failed to parse notification settings from localStorage",
        e,
      );
      return defaultSettings;
    }
  });

  const [initialSettings, setInitialSettings] = useState(settings);
  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const handleCheckboxChange = (
    category: keyof typeof settings.notifications,
    type: "web" | "email",
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category],
          [type]: !prev.notifications[category][type],
        },
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem("trackcodex_notifications", JSON.stringify(settings));
    setInitialSettings(settings);
    window.dispatchEvent(
      new CustomEvent("trackcodex-notification", {
        detail: {
          title: "Notifications Saved",
          message: "Your notification preferences have been updated.",
          type: "success",
        },
      }),
    );
  };

  const handleCancel = () => {
    setSettings(initialSettings);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const notificationCategories = [
    {
      id: "participating",
      label: "Participating",
      description: "Activity in threads you've commented on",
    },
    {
      id: "mentions",
      label: "Mentions",
      description: "Direct @mentions or team mentions",
    },
    {
      id: "failedActions",
      label: "Failed Actions",
      description: "Workflow runs that did not complete",
    },
    {
      id: "securityAlerts",
      label: "Security Alerts",
      description: "Vulnerability alerts and secret scanning",
    },
  ];

  return (
    <div className="space-y-12">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Notifications
        </h1>
        <p className="text-sm text-gh-text-secondary mt-1 max-w-2xl">
          Choose how you want to be notified of activity on TrackCodex. Settings
          apply to all workspaces unless overridden.
        </p>
      </header>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-6">Watching</h2>
        <div className="space-y-6">
          <CustomCheckbox
            label="Automatically watch repositories"
            description="When you're given push access to a repository, automatically start receiving notifications for it."
            checked={settings.watchRepos}
            onChange={(checked) =>
              setSettings((s) => ({ ...s, watchRepos: checked }))
            }
          />
          <CustomCheckbox
            label="Automatically watch teams"
            description="When you join a new team, automatically start receiving notifications for that team's activity."
            checked={settings.watchTeams}
            onChange={(checked) =>
              setSettings((s) => ({ ...s, watchTeams: checked }))
            }
          />
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-6">Email Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gh-text-secondary uppercase tracking-wider mb-2 block">
              Primary notification email
            </label>
            <div className="relative max-w-sm">
              <select
                value={settings.primaryEmail}
                aria-label="Primary notification email"
                onChange={(e) =>
                  setSettings((s) => ({ ...s, primaryEmail: e.target.value }))
                }
                className="w-full bg-gh-bg border border-gh-border rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option value="developer@trackcodex.io">
                  developer@trackcodex.io (Primary)
                </option>
                <option value="alex@personal.com">
                  alex@personal.com (Secondary)
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gh-text-secondary pointer-events-none">
                expand_more
              </span>
            </div>
            <p className="text-xs text-gh-text-secondary mt-2">
              This email will be used for all non-workspace specific alerts.
            </p>
          </div>
          <div className="pt-6 border-t border-gh-border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="flex-shrink-0">
                <div
                  className={`size-5 rounded border-2 flex items-center justify-center transition-all ${settings.marketingEmails ? "bg-gh-bg-secondary border-gh-border" : "bg-gh-bg-secondary border-gh-border"}`}
                >
                  {settings.marketingEmails && (
                    <span className="material-symbols-outlined !text-[14px] text-gh-text font-black"></span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  Include marketing updates
                </p>
                <p className="text-xs text-gh-text-secondary mt-1">
                  Occasional emails about new features, tips, and best
                  practices.
                </p>
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={settings.marketingEmails}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    marketingEmails: e.target.checked,
                  }))
                }
              />
            </label>
          </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-2">Custom Categories</h2>
        <p className="text-sm text-gh-text-secondary mb-6">
          Choose how you want to be notified for specific events.
        </p>
        <div className="border border-gh-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gh-bg">
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Event Type
                </th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Web / Mobile
                </th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gh-border">
              {notificationCategories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{cat.label}</p>
                    <p className="text-xs text-gh-text-secondary">
                      {cat.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CustomCheckbox
                      checked={
                        settings.notifications[
                          cat.id as keyof typeof settings.notifications
                        ].web
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          cat.id as keyof typeof settings.notifications,
                          "web",
                        )
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CustomCheckbox
                      checked={
                        settings.notifications[
                          cat.id as keyof typeof settings.notifications
                        ].email
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          cat.id as keyof typeof settings.notifications,
                          "email",
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="pt-8 border-t border-gh-border flex justify-between items-center">
        <button
          onClick={handleReset}
          className="text-sm font-bold text-gh-text-secondary hover:underline"
        >
          Reset to default settings
        </button>
        {hasChanges && (
          <div className="flex items-center gap-4 animate-in fade-in">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text rounded-lg text-sm font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#a855f7] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#a855f7]/20 hover:brightness-110"
            >
              Save changes
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default NotificationsSettings;
