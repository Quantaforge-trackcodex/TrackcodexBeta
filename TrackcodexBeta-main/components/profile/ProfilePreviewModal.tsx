import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UserProfile } from "../../services/profileService";
import PortfolioDisplay from "./PortfolioDisplay";
import RepositoryShowcase from "./RepositoryShowcase";
import PinnedItemsGrid from "./PinnedItemsGrid";
import ContributionGraph from "./ContributionGraph";

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [portfolioItems, setPortfolioItems] = React.useState<any[]>([]);
  const [repositories, setRepositories] = React.useState<any[]>([]);
  const [pinnedItems, setPinnedItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Define functions before effects to avoid 'use before declare' and hoisting issues
  const loadPortfolio = React.useCallback(async () => {
    if (!profile.id) return;
    try {
      const response = await fetch(`/api/v1/portfolio/${profile.id}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data.items || []);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  }, [profile.id]);

  const loadRepositories = React.useCallback(async () => {
    if (!profile.id) return;
    try {
      const response = await fetch(
        `/api/v1/repositories?userId=${profile.id}&limit=6`,
      );
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.repositories || []);
      }
    } catch (error) {
      console.error("Error loading repositories:", error);
    }
  }, [profile.id]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    await Promise.all([loadPortfolio(), loadRepositories()]);
    setLoading(false);
  }, [loadPortfolio, loadRepositories]);

  const loadPinnedItems = React.useCallback(() => {
    if (!profile.pinnedItems) return;

    const items = [];
    for (const pinnedId of profile.pinnedItems.slice(0, 6)) {
      if (pinnedId.startsWith("portfolio:")) {
        const itemId = pinnedId.replace("portfolio:", "");
        const portItem = portfolioItems.find((p) => p.id === itemId);
        if (portItem) {
          items.push({
            type: "portfolio",
            id: portItem.id,
            title: portItem.title,
            description: portItem.description,
            technologies: portItem.technologies,
            imageUrl: portItem.imageUrl,
            demoUrl: portItem.demoUrl,
            sourceUrl: portItem.sourceUrl,
          });
        }
      } else if (pinnedId.startsWith("repo:")) {
        const repoName = pinnedId.replace("repo:", "");
        const repo = repositories.find((r) => r.name === repoName);
        if (repo) {
          items.push({
            type: "repository",
            id: repo.id,
            title: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stars,
            forks: repo.forks,
          });
        }
      }
    }
    setPinnedItems(items);
  }, [profile.pinnedItems, portfolioItems, repositories]);

  React.useEffect(() => {
    if (isOpen && profile?.id) {
      loadData();
    }
  }, [isOpen, profile?.id, loadData]);

  React.useEffect(() => {
    if (profile && (portfolioItems.length > 0 || repositories.length > 0)) {
      loadPinnedItems();
    }
  }, [profile, portfolioItems, repositories, loadPinnedItems]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[90vh] bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1a1a1f]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400">
                visibility
              </span>
              Public Profile Preview
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              This is how others see your profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            <img
              src={profile.avatar || "/default-avatar.png"}
              alt={profile.name}
              className="size-24 rounded-full border-2 border-white/10"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-lg text-slate-400">@{profile.username}</p>
              {profile.bio && (
                <p className="text-white/80 mt-3">{profile.bio}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined !text-base">
                      location_on
                    </span>
                    {profile.location}
                  </span>
                )}
                {profile.company && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined !text-base">
                      business
                    </span>
                    {profile.company}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                  >
                    <span className="material-symbols-outlined !text-base">
                      link
                    </span>
                    {profile.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile README */}
          {profile.profileReadme && profile.showReadme && (
            <div className="mb-8 p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined !text-xl">
                  description
                </span>
                README
              </h3>
              <div className="prose prose-invert prose-purple max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {profile.profileReadme}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Resume Download */}
          {profile.resumeUrl && profile.showResume && (
            <div className="p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <span className="material-symbols-outlined text-purple-400">
                      work
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Resume / CV</h4>
                    <p className="text-sm text-slate-400">
                      {profile.resumeFilename || "resume.pdf"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined !text-base">
                    download
                  </span>
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          {(!profile.profileReadme || !profile.showReadme) &&
            (!profile.resumeUrl || !profile.showResume) && (
              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined">info</span>
                  <div>
                    <p className="font-medium mb-1">Limited Profile</p>
                    <p className="text-sm text-blue-200">
                      Some profile sections are hidden based on your privacy
                      settings.
                      {!profile.showReadme && " Your README is private."}
                      {!profile.showResume && " Your resume is private."}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Pinned Items */}
          {pinnedItems.length > 0 && (
            <div className="mb-8 p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined !text-xl">
                  push_pin
                </span>
                Pinned
              </h3>
              <PinnedItemsGrid
                items={pinnedItems}
                userId={profile.id}
                isOwner={false}
              />
            </div>
          )}

          {/* Portfolio */}
          {profile.showPortfolio && portfolioItems.length > 0 && (
            <div className="mb-8 p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined !text-xl">
                  work_outline
                </span>
                Portfolio
              </h3>
              <PortfolioDisplay items={portfolioItems} isOwner={false} />
            </div>
          )}

          {/* Repositories */}
          {profile.showRepositories && repositories.length > 0 && (
            <div className="mb-8 p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined !text-xl">
                  folder
                </span>
                Repositories
              </h3>
              <RepositoryShowcase
                repositories={repositories}
                userId={profile.id}
                isOwner={false}
              />
            </div>
          )}

          {/* Contribution Graph */}
          {profile.showContributions && (
            <div className="mb-8 p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined !text-xl">
                  insert_chart
                </span>
                Contributions
              </h3>
              <ContributionGraph userId={profile.id} />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-[#1a1a1f] border border-white/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">
                {profile.followers || 0}
              </div>
              <div className="text-sm text-slate-400">Followers</div>
            </div>
            <div className="p-4 bg-[#1a1a1f] border border-white/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">
                {profile.following || 0}
              </div>
              <div className="text-sm text-slate-400">Following</div>
            </div>
            <div className="p-4 bg-[#1a1a1f] border border-white/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">
                {new Date(profile.createdAt || "2024-01-01").getFullYear()}
              </div>
              <div className="text-sm text-slate-400">Joined</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#1a1a1f] flex justify-between items-center">
          <p className="text-xs text-slate-400">
            💡 Adjust your privacy settings to control what others can see
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreviewModal;
