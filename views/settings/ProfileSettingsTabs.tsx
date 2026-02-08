import React, { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import ProfileReadmeEditor from "../../components/profile/ProfileReadmeEditor";
import ResumeUploader from "../../components/profile/ResumeUploader";
import ProfilePreviewModal from "../../components/profile/ProfilePreviewModal";
import { PortfolioManager } from "../../components/profile/PortfolioManager";
import { useAuth } from "../../context/AuthContext";

type Tab = "profile" | "readme" | "resume" | "portfolio";

export const ProfileSettingsTabs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profileReadme, setProfileReadme] = useState(user?.profileReadme || "");
  const [resumeData, setResumeData] = useState<any>(null);
  const [showResume, setShowResume] = useState(user?.showResume || false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSaveReadme = async (content: string) => {
    try {
      const response = await fetch(
        `/api/v1/profile/${user?.id}/profile-readme`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ readme: content }),
        },
      );

      if (!response.ok) throw new Error("Failed to save README");

      setProfileReadme(content);
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "README Updated",
            message: "Your profile README has been saved successfully",
            type: "success",
          },
        }),
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "Error",
            message: "Failed to update README",
            type: "error",
          },
        }),
      );
    }
  };

  const handlePrivacyChange = async (show: boolean) => {
    try {
      const response = await fetch(`/api/v1/profile/${user?.id}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ showResume: show }),
      });

      if (!response.ok) throw new Error("Failed to update privacy");

      setShowResume(show);
    } catch (error) {
      console.error("Privacy update error:", error);
    }
  };

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: "person" },
    { id: "readme" as Tab, label: "Profile README", icon: "description" },
    { id: "resume" as Tab, label: "Resume / CV", icon: "work" },
    { id: "portfolio" as Tab, label: "Portfolio", icon: "inventory_2" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gh-border bg-gh-bg-secondary">
        <div className="flex items-center justify-between px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-gh-text"
                    : "text-gh-text-secondary hover:text-gh-text"
                }`}
              >
                <span className="material-symbols-outlined !text-[18px]">
                  {tab.icon}
                </span>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
                )}
              </button>
            ))}
          </div>

          {/* Preview Button */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined !text-[18px]">
              visibility
            </span>
            View what others see
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === "profile" && (
          <div className="max-w-5xl mx-auto p-8">
            <ProfileSettings />
          </div>
        )}

        {activeTab === "readme" && user && (
          <div className="h-full">
            <ProfileReadmeEditor
              initialContent={profileReadme}
              onSave={handleSaveReadme}
              onCancel={() => setActiveTab("profile")}
            />
          </div>
        )}

        {activeTab === "resume" && user && (
          <div className="max-w-5xl mx-auto p-8">
            <ResumeUploader
              userId={user.id}
              currentResume={resumeData}
              showResume={showResume}
              onUploadSuccess={() => {
                // Reload resume data
                window.location.reload();
              }}
              onDeleteSuccess={() => {
                setResumeData(null);
              }}
              onPrivacyChange={handlePrivacyChange}
            />
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="max-w-6xl mx-auto">
            <PortfolioManager />
          </div>
        )}
      </div>

      {/* Profile Preview Modal */}
      {user && (
        <ProfilePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          profile={{
            ...user,
            profileReadme,
            showResume,
            showReadme: user.showReadme ?? true,
          }}
        />
      )}
    </div>
  );
};

export default ProfileSettingsTabs;
