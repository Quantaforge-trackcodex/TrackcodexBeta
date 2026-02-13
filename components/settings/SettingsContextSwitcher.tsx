import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../../services/profile";

interface SettingsContextSwitcherProps {
  currentContext: "personal" | "strata";
  strataName?: string;
  strataAvatar?: string;
  strataId?: string;
}

const SettingsContextSwitcher: React.FC<SettingsContextSwitcherProps> = ({
  currentContext,
  strataName,
  strataAvatar,
  strataId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profile = profileService.getProfile();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePersonalClick = () => {
    navigate("/settings/profile");
    setIsOpen(false);
  };

  const handleStrataClick = (id: string) => {
    navigate(`/strata/${id}/settings/general`);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gh-bg-secondary transition-colors group text-left"
      >
        <div className="flex items-center gap-3">
          {currentContext === "personal" ? (
            <img
              src={profile.avatar}
              className="size-8 rounded-full border border-gh-border"
              alt="Profile"
            />
          ) : (
            <img
              src={strataAvatar}
              className="size-8 rounded-md border border-gh-border p-0.5"
              alt="Strata"
            />
          )}
          <div>
            <div className="text-sm font-bold text-gh-text group-hover:text-primary transition-colors">
              {currentContext === "personal" ? profile.username : strataName}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gh-text-secondary font-medium">
              <span>
                {currentContext === "personal" ? "Personal" : "Strata"}
              </span>
              <span className="material-symbols-outlined !text-[12px]">
                sync_alt
              </span>
              <span>Switch context</span>
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined text-gh-text-secondary">
          arrow_drop_down
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-[300px] bg-gh-bg-secondary border border-gh-border rounded-xl shadow-2xl z-50 overflow-hidden mt-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gh-bg px-4 py-2 border-b border-gh-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gh-text-secondary">
              Switch Settings Context
            </span>
          </div>

          <div className="p-2 space-y-1">
            {/* Personal Option */}
            <button
              onClick={handlePersonalClick}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${currentContext === "personal" ? "bg-primary/10" : "hover:bg-gh-bg hover:text-gh-text"}`}
            >
              <img
                src={profile.avatar}
                alt={profile.username}
                className="size-8 rounded-full border border-gh-border"
              />
              <div className="text-left">
                <div
                  className={`text-sm font-bold ${currentContext === "personal" ? "text-primary" : "text-gh-text"}`}
                >
                  {profile.username}
                </div>
                <div className="text-xs text-gh-text-secondary">
                  Personal account
                </div>
              </div>
              {currentContext === "personal" && (
                <span className="material-symbols-outlined text-primary ml-auto">
                  check
                </span>
              )}
            </button>

            <div className="h-px bg-gh-border my-1 mx-2"></div>

            {/* Mock Strata Option */}
            <button
              onClick={() => handleStrataClick("quantaforge")}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${currentContext === "strata" && strataId === "quantaforge" ? "bg-primary/10" : "hover:bg-gh-bg hover:text-gh-text"}`}
            >
              <div className="size-8 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                <span className="material-symbols-outlined !text-lg">hub</span>
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-bold ${currentContext === "strata" && strataId === "quantaforge" ? "text-primary" : "text-gh-text"}`}
                >
                  quantaforge
                </div>
                <div className="text-xs text-gh-text-secondary">
                  Strata
                </div>
              </div>
              {currentContext === "strata" && strataId === "quantaforge" && (
                <span className="material-symbols-outlined text-primary ml-auto">
                  check
                </span>
              )}
            </button>

            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gh-bg hover:text-gh-text transition-colors opacity-50 cursor-not-allowed">
              <div className="size-8 rounded-md bg-gh-bg flex items-center justify-center text-gh-text-secondary border border-gh-border">
                <span className="material-symbols-outlined !text-lg">add</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-gh-text-secondary">
                  Create Strata
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsContextSwitcher;
