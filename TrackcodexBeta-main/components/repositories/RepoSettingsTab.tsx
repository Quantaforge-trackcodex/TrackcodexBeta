import React, { useState, useEffect } from "react";
import { repoService, FullRepoSettings } from "../../services/repoService";
import ManageAccess from "../repo/ManageAccess";
import RepoWebhookSettings from "./RepoWebhookSettings";
import EnvironmentSettings from "../repo/EnvironmentSettings";

interface RepoSettingsTabProps {
  repo: any;
}

// Inner components defined outside to avoid re-renders and React errors
const Section = ({
  title,
  children,
  description,
}: {
  title: string;
  children: React.ReactNode;
  description?: string;
}) => (
  <div className="py-8 border-b border-gh-border last:border-0 animate-in fade-in duration-500">
    <h3 className="text-lg font-semibold text-gh-text mb-1">{title}</h3>
    {description && (
      <p className="text-sm text-gh-text-secondary mb-6">{description}</p>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingRow = ({
  label,
  description,
  children,
  control,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
  control?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gh-bg-secondary/50 transition-colors border border-transparent hover:border-gh-border/50">
    <div className="flex-1">
      <label className="text-[14px] font-bold text-gh-text mb-1 block">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gh-text-secondary leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
    {control && <div className="shrink-0">{control}</div>}
  </div>
);

const CheckboxRow = ({
  label,
  description,
  checked,
  onChange,
  subLabel,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  subLabel?: string;
}) => (
  <div
    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gh-bg-secondary transition-all cursor-pointer group border border-transparent hover:border-gh-border/30"
    onClick={onChange}
  >
    <div
      className={`mt-1 size-5 rounded-md border flex items-center justify-center transition-all ${checked ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-gh-bg border-gh-border group-hover:border-gh-text-secondary"}`}
    >
      {checked && (
        <span className="material-symbols-outlined !text-[14px] text-white font-black">
          check
        </span>
      )}
    </div>
    <div className="flex-1">
      <span className="text-sm font-bold text-gh-text block mb-1">{label}</span>
      <p className="text-xs text-gh-text-secondary leading-relaxed opacity-80">
        {description}
      </p>
      {subLabel && (
        <p className="text-[10px] text-gh-text-tertiary mt-2 font-black uppercase tracking-widest">
          {subLabel}
        </p>
      )}
    </div>
  </div>
);

const RepoSettingsTab: React.FC<RepoSettingsTabProps> = ({ repo }) => {
  const [settings, setSettings] = useState<FullRepoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("General");
  const [renameValue, setRenameValue] = useState(repo.name);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await repoService.getSettings(repo.id);
        // Default values merging
        setSettings({
          name: repo.name,
          isTemplate: data.isTemplate ?? false,
          requireCommitSignOff: data.requireCommitSignOff ?? true,
          defaultBranch: data.defaultBranch ?? "main",
          releaseImmutability: data.releaseImmutability ?? true,
          features: {
            wikis: data.features?.wikis ?? true,
            restrictWiki: data.features?.restrictWiki ?? true,
            issues: data.features?.issues ?? true,
            sponsorships: data.features?.sponsorships ?? false,
            preserve: data.features?.preserve ?? true,
            discussions: data.features?.discussions ?? true,
            projects: data.features?.projects ?? true,
          },
          pullRequests: {
            allowMerge: data.pullRequests?.allowMerge ?? true,
            mergeMessage:
              data.pullRequests?.mergeMessage ??
              "Pull request title and description",
            allowSquash: data.pullRequests?.allowSquash ?? true,
            squashMessage:
              data.pullRequests?.squashMessage ??
              "Pull request title and commit details",
            allowRebase: data.pullRequests?.allowRebase ?? true,
            alwaysSuggestUpdate: data.pullRequests?.alwaysSuggestUpdate ?? true,
            autoMerge: data.pullRequests?.autoMerge ?? false,
            deleteHead: data.pullRequests?.deleteHead ?? true,
          },
          archives: {
            includeLfs: data.archives?.includeLfs ?? false,
          },
          pushes: {
            limitEnabled: data.pushes?.limitEnabled ?? true,
            limit: data.pushes?.limit ?? 5,
          },
          issues: {
            autoClose: data.issues?.autoClose ?? true,
          },
        });
        setRenameValue(repo.name);
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [repo.id, repo.name]);

  const handleUpdate = async (
    updater: (s: FullRepoSettings) => FullRepoSettings,
  ) => {
    if (!settings) return;
    const next = updater({ ...settings });
    setSaving(true);
    try {
      await repoService.updateSettings(repo.id, next);
      setSettings(next);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gh-text-secondary gap-4">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold animate-pulse">
          Initializing Administrative Core...
        </p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      {/* Saving Indicator Overlay */}
      {saving && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-gh-bg-secondary border border-gh-border px-5 py-2.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-black uppercase tracking-widest text-gh-text">
            Saving changes...
          </span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className="w-full lg:w-[240px] shrink-0 space-y-1">
        {[
          { id: "General", icon: "settings", label: "General" },
          { id: "Access", icon: "group", label: "Collaborators and teams" },
          { id: "Branches", icon: "alt_route", label: "Branches" },
          { id: "Actions", icon: "play_circle", label: "Actions" },
          { id: "Webhooks", icon: "webhook", label: "Webhooks" },
          { id: "Environments", icon: "cloud", label: "Environments" },
          { id: "Codespaces", icon: "terminal", label: "Codespaces" },
          { id: "Pages", icon: "browser_updated", label: "Pages" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === item.id
                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"
              }`}
          >
            <span
              className={`material-symbols-outlined !text-[20px] ${activeSubTab === item.id ? "text-primary-foreground" : "opacity-60"}`}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <div className="pt-6 pb-2 px-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-gh-text-tertiary">
            Security Analysis
          </span>
        </div>
        {[
          { id: "Security", icon: "verified_user", label: "Code security" },
          { id: "Secrets", icon: "key", label: "Secrets & Keys" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeSubTab === item.id ? "bg-primary text-primary-foreground shadow-lg" : "text-gh-text-secondary hover:bg-gh-bg-secondary hover:text-gh-text"}`}
          >
            <span className="material-symbols-outlined !text-[20px] opacity-60">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-gh-bg-secondary/20 border border-gh-border rounded-[2.5rem] p-4 md:p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] group-hover:bg-primary/10 transition-all duration-1000"></div>

        {activeSubTab === "General" && (
          <div className="relative z-10 space-y-2">
            <Section title="General">
              <SettingRow
                label="Repository name"
                control={
                  <div className="flex gap-3">
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      title="Repository Name"
                      placeholder="Repository Name"
                      className="bg-gh-bg border border-gh-border rounded-xl px-4 py-2 text-sm text-gh-text focus:ring-2 focus:ring-primary/50 outline-none min-w-[300px] font-mono transition-all"
                    />
                    <button
                      onClick={() =>
                        handleUpdate((s) => ({ ...s, name: renameValue }))
                      }
                      className="bg-gh-bg-secondary border border-gh-border hover:border-gh-text hover:bg-gh-bg-tertiary px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                    >
                      Rename
                    </button>
                  </div>
                }
              />

              <div className="grid grid-cols-1 gap-1 text-sm mt-4">
                <CheckboxRow
                  label="Template repository"
                  description="Template repositories let users generate new repositories with the same directory structure and files."
                  checked={settings.isTemplate || false}
                  onChange={() =>
                    handleUpdate((s) => ({ ...s, isTemplate: !s.isTemplate }))
                  }
                />
                <CheckboxRow
                  label="Require contributors to sign off on web-based commits"
                  description="Enabling this setting will require contributors to sign off on commits made through TrackCodex's web interface. Signing off is a way for contributors to affirm that their commit complies with the Developer Certificate of Origin (DCO)."
                  checked={settings.requireCommitSignOff || false}
                  onChange={() =>
                    handleUpdate((s) => ({
                      ...s,
                      requireCommitSignOff: !s.requireCommitSignOff,
                    }))
                  }
                />
              </div>
            </Section>

            <Section
              title="Default branch"
              description="The default branch is considered the “base” branch in your repository, against which all pull requests and code commits are automatically made."
            >
              <div className="flex items-center gap-3 p-4 bg-gh-bg border border-gh-border rounded-2xl group hover:border-primary/50 transition-all w-fit pr-10 shadow-sm">
                <div className="px-3 py-1.5 bg-gh-bg-secondary border border-gh-border rounded-lg text-sm font-mono text-primary font-black">
                  {settings.defaultBranch}
                </div>
                <button className="material-symbols-outlined !text-[20px] text-gh-text-secondary hover:text-primary transition-colors">
                  edit
                </button>
              </div>
            </Section>

            <Section title="Releases">
              <CheckboxRow
                label="Enable release immutability"
                description="Disallow assets and tags from being modified once a release is published."
                checked={settings.releaseImmutability || false}
                onChange={() =>
                  handleUpdate((s) => ({
                    ...s,
                    releaseImmutability: !s.releaseImmutability,
                  }))
                }
              />
            </Section>

            <Section title="Social preview">
              <div className="space-y-4">
                <p className="text-sm text-gh-text-secondary leading-relaxed max-w-2xl">
                  Upload an image to customize your repository’s social media
                  preview. Images should be at least 640×320px (1280×640px for
                  best display).
                </p>
                <div className="relative rounded-3xl overflow-hidden border border-gh-border aspect-[2/1] bg-gh-bg-secondary group/img shadow-2xl">
                  <img
                    src={
                      settings.socialPreview ||
                      "https://images.unsplash.com/photo-1618477371303-f2a56f4d2a3e?auto=format&fit=crop&q=80&w=1280&h=640"
                    }
                    alt="Social Preview"
                    className="w-full h-full object-cover opacity-80 group-hover/img:scale-105 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute top-6 left-6 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-xs font-black uppercase shadow-[0_20px_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all active:scale-95">
                      <span className="material-symbols-outlined !text-lg">
                        edit
                      </span>
                      Customize Preview
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Features">
              <div className="p-4 bg-gh-bg-secondary/40 border border-gh-border rounded-[2rem] space-y-4">
                <CheckboxRow
                  label="Wikis"
                  description="Wikis host documentation for your repository."
                  checked={settings.features?.wikis || false}
                  onChange={() =>
                    handleUpdate((s) => ({
                      ...s,
                      features: { ...s.features, wikis: !s.features?.wikis },
                    }))
                  }
                />
                {settings.features?.wikis && (
                  <div className="pl-12 pb-2">
                    <CheckboxRow
                      label="Restrict editing to collaborators only"
                      description="Public wikis will still be readable by everyone."
                      checked={settings.features?.restrictWiki || false}
                      onChange={() =>
                        handleUpdate((s) => ({
                          ...s,
                          features: {
                            ...s.features,
                            restrictWiki: !s.features?.restrictWiki,
                          },
                        }))
                      }
                    />
                  </div>
                )}
                <div className="h-px bg-gh-border/50 mx-4"></div>
                <div className="space-y-4">
                  <CheckboxRow
                    label="Issues"
                    description="Issues integrate lightweight task tracking into your repository. Keep projects on track with issue labels and milestones, and reference them in commit messages."
                    checked={settings.features?.issues || false}
                    onChange={() =>
                      handleUpdate((s) => ({
                        ...s,
                        features: {
                          ...s.features,
                          issues: !s.features?.issues,
                        },
                      }))
                    }
                  />
                  {settings.features?.issues && (
                    <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl flex items-center justify-between ml-12 animate-in zoom-in-95 duration-300">
                      <div>
                        <h4 className="text-sm font-black text-gh-text mb-1 uppercase tracking-widest">
                          Organized Workflows
                        </h4>
                        <p className="text-xs text-gh-text-secondary opacity-70">
                          Give contributors issue templates that help you cut
                          through the noise.
                        </p>
                      </div>
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95">
                        Set up templates
                      </button>
                    </div>
                  )}
                </div>
                <div className="h-px bg-gh-border/50 mx-4"></div>
                <CheckboxRow
                  label="Discussions"
                  description="Discussions is the space for your community to have conversations, ask questions and post answers."
                  checked={settings.features?.discussions || false}
                  onChange={() =>
                    handleUpdate((s) => ({
                      ...s,
                      features: {
                        ...s.features,
                        discussions: !s.features?.discussions,
                      },
                    }))
                  }
                />
                <div className="h-px bg-gh-border/50 mx-4"></div>
                <CheckboxRow
                  label="Projects"
                  description="Projects on TrackCodex are suitable for cross-repository development efforts such as feature work or complex roadmaps."
                  checked={settings.features?.projects || false}
                  onChange={() =>
                    handleUpdate((s) => ({
                      ...s,
                      features: {
                        ...s.features,
                        projects: !s.features?.projects,
                      },
                    }))
                  }
                />
              </div>
            </Section>

            <Section title="Pull Requests">
              <div className="p-4 bg-gh-bg-secondary/40 border border-gh-border rounded-[2rem] space-y-8">
                <div className="space-y-6">
                  <p className="text-xs text-gh-text-tertiary font-bold uppercase tracking-widest opacity-60">
                    Merge Strategies
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                      <CheckboxRow
                        label="Allow merge commits"
                        description="Add all commits from the head branch onto the base branch with a merge commit."
                        checked={settings.pullRequests?.allowMerge || false}
                        onChange={() =>
                          handleUpdate((s) => ({
                            ...s,
                            pullRequests: {
                              ...s.pullRequests,
                              allowMerge: !s.pullRequests?.allowMerge,
                            },
                          }))
                        }
                      />
                      {settings.pullRequests?.allowMerge && (
                        <div className="ml-12 space-y-3 animate-in fade-in duration-300">
                          <label className="text-[10px] font-black uppercase text-gh-text-tertiary tracking-tighter">
                            Default commit message
                          </label>
                          <select
                            title="Merge Commit Message"
                            value={settings.pullRequests?.mergeMessage}
                            onChange={(e) =>
                              handleUpdate((s) => ({
                                ...s,
                                pullRequests: {
                                  ...s.pullRequests,
                                  mergeMessage: e.target.value,
                                },
                              }))
                            }
                            className="w-full max-w-sm bg-gh-bg border border-gh-border rounded-xl px-4 py-2 text-xs text-gh-text focus:ring-2 focus:ring-primary/40 outline-none transition-all cursor-pointer"
                          >
                            <option>Pull request title and description</option>
                            <option>
                              Pull request title and commit details
                            </option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <CheckboxRow
                        label="Allow squash merging"
                        description="Combine all commits from the head branch into a single commit in the base branch."
                        checked={settings.pullRequests?.allowSquash || false}
                        onChange={() =>
                          handleUpdate((s) => ({
                            ...s,
                            pullRequests: {
                              ...s.pullRequests,
                              allowSquash: !s.pullRequests?.allowSquash,
                            },
                          }))
                        }
                      />
                      {settings.pullRequests?.allowSquash && (
                        <div className="ml-12 space-y-3 animate-in fade-in duration-300">
                          <label className="text-[10px] font-black uppercase text-gh-text-tertiary tracking-tighter">
                            Default commit message
                          </label>
                          <select
                            title="Squash Commit Message"
                            value={settings.pullRequests?.squashMessage}
                            onChange={(e) =>
                              handleUpdate((s) => ({
                                ...s,
                                pullRequests: {
                                  ...s.pullRequests,
                                  squashMessage: e.target.value,
                                },
                              }))
                            }
                            className="w-full max-w-sm bg-gh-bg border border-gh-border rounded-xl px-4 py-2 text-xs text-gh-text focus:ring-2 focus:ring-primary/40 outline-none transition-all cursor-pointer"
                          >
                            <option>
                              Pull request title and commit details
                            </option>
                            <option>Pull request title and description</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <CheckboxRow
                      label="Allow rebase merging"
                      description="Add all commits from the head branch onto the base branch individually."
                      checked={settings.pullRequests?.allowRebase || false}
                      onChange={() =>
                        handleUpdate((s) => ({
                          ...s,
                          pullRequests: {
                            ...s.pullRequests,
                            allowRebase: !s.pullRequests?.allowRebase,
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="h-px bg-gh-border/50 mx-4"></div>

                <div className="space-y-4">
                  <p className="text-xs text-gh-text-tertiary font-black uppercase tracking-widest pl-4">
                    Flow Optimization
                  </p>
                  <CheckboxRow
                    label="Always suggest updating branches"
                    description="Whenever there are new changes available in the base branch, present an “update branch” option."
                    checked={
                      settings.pullRequests?.alwaysSuggestUpdate || false
                    }
                    onChange={() =>
                      handleUpdate((s) => ({
                        ...s,
                        pullRequests: {
                          ...s.pullRequests,
                          alwaysSuggestUpdate:
                            !s.pullRequests?.alwaysSuggestUpdate,
                        },
                      }))
                    }
                  />
                  <div className="p-6 border border-primary/20 bg-primary/5 rounded-3xl mx-4">
                    <CheckboxRow
                      label="Allow auto-merge"
                      description="Automatically merge once all required reviews and status checks have passed."
                      checked={settings.pullRequests?.autoMerge || false}
                      onChange={() =>
                        handleUpdate((s) => ({
                          ...s,
                          pullRequests: {
                            ...s.pullRequests,
                            autoMerge: !s.pullRequests?.autoMerge,
                          },
                        }))
                      }
                    />
                  </div>
                  <CheckboxRow
                    label="Automatically delete head branches"
                    description="Successfully merged head branches are deleted instantly."
                    checked={settings.pullRequests?.deleteHead || false}
                    onChange={() =>
                      handleUpdate((s) => ({
                        ...s,
                        pullRequests: {
                          ...s.pullRequests,
                          deleteHead: !s.pullRequests?.deleteHead,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </Section>

            <Section title="Danger Zone">
              <div className="border border-red-500/20 rounded-[2.5rem] overflow-hidden bg-red-500/5 shadow-2xl">
                {[
                  {
                    label: "Change repository visibility",
                    desc: "This repository is currently public. Anyone on the internet can see it.",
                    btn: "Make Private",
                  },
                  {
                    label: "Disable branch protection",
                    desc: "Remove safeguards preventing direct pushes and forced deletion.",
                    btn: "Disable Rules",
                  },
                  {
                    label: "Transfer ownership",
                    desc: "Move this repository to another account or organization.",
                    btn: "Transfer",
                  },
                  {
                    label: "Archive this repository",
                    desc: "Mark as read-only and close all active development.",
                    btn: "Archive",
                  },
                  {
                    label: "Delete this repository",
                    desc: "Permanently remove this repository and all its history. There is no undo.",
                    btn: "Delete repository",
                    danger: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-center justify-between p-8 border-b border-red-500/10 last:border-0 hover:bg-red-500/10 transition-all gap-4"
                  >
                    <div className="text-center md:text-left">
                      <h4 className="text-[14px] font-black text-gh-text mb-1 uppercase tracking-tight">
                        {item.label}
                      </h4>
                      <p className="text-xs text-gh-text-tertiary max-w-[500px] leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border whitespace-nowrap active:brightness-90 ${item.danger ? "bg-red-600 text-white border-red-600 hover:bg-red-500 shadow-xl shadow-red-600/20" : "bg-gh-bg border-gh-border text-red-500/80 hover:border-red-500 hover:text-red-500 hover:shadow-lg"}`}
                    >
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeSubTab === "Access" && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <ManageAccess repoId={repo.id} />
          </div>
        )}

        {activeSubTab === "Webhooks" && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <RepoWebhookSettings repoId={repo.id} />
          </div>
        )}

        {activeSubTab === "Environments" && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <EnvironmentSettings repoId={repo.id} />
          </div>
        )}

        {activeSubTab !== "General" &&
          activeSubTab !== "Access" &&
          activeSubTab !== "Webhooks" &&
          activeSubTab !== "Environments" && (
            <div className="flex flex-col items-center justify-center py-40 text-gh-text-secondary opacity-50 h-full animate-in zoom-in-95 duration-700">
              <div className="size-20 rounded-full bg-gh-border/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined !text-[48px]">
                  construction
                </span>
              </div>
              <h2 className="text-xl font-extrabold mb-2 uppercase tracking-widest">
                {activeSubTab} Dashboard
              </h2>
              <p className="max-w-xs text-center text-xs font-bold leading-relaxed">
                This administrative module is pending synchronization with the
                next core update.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default RepoSettingsTab;
