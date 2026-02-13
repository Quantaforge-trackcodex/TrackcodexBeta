import React, { useState } from "react";

interface NotificationSettings {
  defaultEmail: string;
  customRouting: boolean;
  watching: {
    notifyOn: string;
  };
  participating: {
    notifyOn: string;
  };
  customizeEmailUpdates: string[];
  ignoredRepos: string[];
  actions: {
    notifyOn: string;
  };
  dependabotAlerts: {
    notifyOn: string;
  };
  dependabotDigest: boolean;
  securityCampaigns: boolean;
  deployKeyAlerts: boolean;
  inProductMessages: boolean;
}

const NotificationsSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    defaultEmail: "quantaforge2@gmail.com",
    customRouting: false,
    watching: {
      notifyOn: "github-email",
    },
    participating: {
      notifyOn: "github-email",
    },
    customizeEmailUpdates: ["reviews", "pushes", "comments"],
    ignoredRepos: [],
    actions: {
      notifyOn: "github-email-failed",
    },
    dependabotAlerts: {
      notifyOn: "github-email-cli",
    },
    dependabotDigest: false,
    securityCampaigns: true,
    deployKeyAlerts: true,
    inProductMessages: true,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Add save logic here
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
          Notifications
        </h1>
      </header>

      {/* Default Notifications Email */}
      <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-gh-text mb-2">
          Default notifications email
        </h2>
        <p className="text-sm text-gh-text-secondary mb-4">
          Choose where you'd like emails to be sent. You can add more email addresses.{" "}
          <a href="#" className="text-primary hover:underline">
            Use custom routes
          </a>{" "}
          to specify different email addresses to be used for individual organizations.
        </p>
        <div className="flex items-center gap-3">
          <select
            value={settings.defaultEmail}
            onChange={(e) =>
              setSettings({ ...settings, defaultEmail: e.target.value })
            }
            className="px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text"
          >
            <option value="quantaforge2@gmail.com">quantaforge2@gmail.com</option>
          </select>
          <button className="px-4 py-2 bg-gh-bg border border-gh-border text-gh-text rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-all">
            Custom routing
          </button>
        </div>
      </section>

      {/* Subscriptions */}
      <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gh-border">
          <h2 className="text-lg font-bold text-gh-text">Subscriptions</h2>
        </div>

        {/* Watching */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">Watching</h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Notifications for all repositories, teams, or conversations you're watching.{" "}
            <a href="#" className="text-primary hover:underline">
              View watched repositories
            </a>
            .
          </p>
          <select
            value={settings.watching.notifyOn}
            onChange={(e) =>
              setSettings({
                ...settings,
                watching: { notifyOn: e.target.value },
              })
            }
            className="px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text"
          >
            <option value="github-email">Notify me: on TrackCodex, Email</option>
            <option value="github">Notify me: on TrackCodex</option>
            <option value="email">Notify me: Email</option>
          </select>
        </div>

        {/* Participating, @mentions and custom */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">
            Participating, @mentions and custom
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Notifications for the conversations you are participating in, or if someone cites
            you with an @mention. Also for all activity when subscribed to specific events.
          </p>
          <select
            value={settings.participating.notifyOn}
            onChange={(e) =>
              setSettings({
                ...settings,
                participating: { notifyOn: e.target.value },
              })
            }
            className="px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text"
          >
            <option value="github-email">Notify me: on TrackCodex, Email</option>
            <option value="github">Notify me: on TrackCodex</option>
            <option value="email">Notify me: Email</option>
          </select>
        </div>

        {/* Customize email updates */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">
            Customize email updates
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Choose which additional events you'll receive emails for when participating or
            watching.
          </p>
          <button className="px-3 py-1.5 bg-gh-bg border border-gh-border text-gh-text rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-all">
            Reviews, Pushes, Comments
          </button>
        </div>

        {/* Ignored repositories */}
        <div className="p-6">
          <h3 className="text-base font-bold text-gh-text mb-2">
            Ignored repositories
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            You'll never be notified.{" "}
            <a href="#" className="text-primary hover:underline">
              View ignored repositories
            </a>
            .
          </p>
        </div>
      </section>

      {/* System */}
      <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gh-border">
          <h2 className="text-lg font-bold text-gh-text">System</h2>
        </div>

        {/* Actions */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">Actions</h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Notifications for workflow runs on repositories set up with{" "}
            <a href="#" className="text-primary hover:underline">
              TrackCodex Actions
            </a>
            .
          </p>
          <select
            value={settings.actions.notifyOn}
            onChange={(e) =>
              setSettings({
                ...settings,
                actions: { notifyOn: e.target.value },
              })
            }
            className="px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text"
          >
            <option value="github-email-failed">
              Notify me: on TrackCodex, Email (Failed workflows only)
            </option>
            <option value="github-email">Notify me: on TrackCodex, Email</option>
            <option value="github">Notify me: on TrackCodex</option>
          </select>
        </div>

        {/* Dependabot alerts: New vulnerabilities */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">
            Dependabot alerts: New vulnerabilities
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            When you're given access to{" "}
            <a href="#" className="text-primary hover:underline">
              Dependabot alerts
            </a>
            , automatically receive notifications when a new vulnerability is found in one of
            your dependencies.
          </p>
          <select
            value={settings.dependabotAlerts.notifyOn}
            onChange={(e) =>
              setSettings({
                ...settings,
                dependabotAlerts: { notifyOn: e.target.value },
              })
            }
            className="px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text"
          >
            <option value="github-email-cli">
              Notify me: on TrackCodex, Email, CLI
            </option>
            <option value="github-email">Notify me: on TrackCodex, Email</option>
            <option value="github">Notify me: on TrackCodex</option>
          </select>
        </div>

        {/* Dependabot alerts: Email digest */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">
            Dependabot alerts: Email digest
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Email a regular summary of Dependabot alerts for up to 10 of your repositories.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  dependabotDigest: !settings.dependabotDigest,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.dependabotDigest ? "bg-primary" : "bg-gh-border"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.dependabotDigest ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-sm text-gh-text">
              {settings.dependabotDigest ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* Security campaign emails */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">
            Security campaign emails
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Receive email notifications about security{" "}
            <a href="#" className="text-primary hover:underline">
              campaigns
            </a>{" "}
            in repositories where you have access to security alerts.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  securityCampaigns: !settings.securityCampaigns,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.securityCampaigns ? "bg-primary" : "bg-gh-border"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.securityCampaigns ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-sm text-gh-text">
              {settings.securityCampaigns ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* 'Deploy key' alert email */}
        <div className="p-6 border-b border-gh-border">
          <h3 className="text-base font-bold text-gh-text mb-2">
            'Deploy key' alert email
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            When you are given admin permissions to an organization, automatically receive
            notifications when a new deploy key is added.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  deployKeyAlerts: !settings.deployKeyAlerts,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.deployKeyAlerts ? "bg-primary" : "bg-gh-border"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.deployKeyAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-sm text-gh-text">
              {settings.deployKeyAlerts ? "On" : "Off"}
            </span>
          </div>
        </div>

        {/* In-product messages */}
        <div className="p-6">
          <h3 className="text-base font-bold text-gh-text mb-2">
            In-product messages
          </h3>
          <p className="text-sm text-gh-text-secondary mb-4">
            Get tips, solutions and exclusive offers from TrackCodex about products, services
            and events we think you might find interesting.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  inProductMessages: !settings.inProductMessages,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.inProductMessages ? "bg-primary" : "bg-gh-border"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.inProductMessages ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span className="text-sm text-gh-text">
              {settings.inProductMessages ? "On" : "Off"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotificationsSettings;
