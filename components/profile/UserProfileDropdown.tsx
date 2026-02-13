import React from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../../services/profile";
import { strataNetworkApi, StrataNetwork } from "../../services/strata";

interface MenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
}

const MenuItem = ({
  icon,
  label,
  onClick,
  badge,
  badgeColor,
}: MenuItemProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-1.5 text-[13px] text-gh-text-secondary hover:text-white hover:bg-white/5 transition-colors group text-left"
  >
    <span className="material-symbols-outlined !text-[18px] opacity-70 group-hover:opacity-100">
      {icon}
    </span>
    <span className="flex-1">{label}</span>
    {badge && (
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border border-white/10 ${badgeColor || "bg-gh-bg-secondary text-gh-text-secondary"}`}
      >
        {badge}
      </span>
    )}
  </button>
);

interface UserProfileDropdownProps {
  profile: UserProfile;
  onClose: () => void;
  logout: () => void;
}

const UserProfileDropdown = ({
  profile,
  onClose,
  logout,
}: UserProfileDropdownProps) => {
  const navigate = useNavigate();
  const [enterprises, setEnterprises] = React.useState<StrataNetwork[]>([]);

  const loadEnterprises = async () => {
    try {
      const data = await strataNetworkApi.getMyNetworks();
      setEnterprises(data);
    } catch (e) {
      console.error("Failed to load user enterprises", e);
    }
  };

  React.useEffect(() => {
    loadEnterprises();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-gh-bg-secondary border border-gh-border rounded-xl shadow-2xl z-[500] py-3 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl bg-gh-bg-secondary/95">
      {/* Header Info */}
      <div
        onClick={() => handleNavigate("/profile")}
        className="px-4 py-2 border-b border-gh-border mb-2 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={profile.avatar}
              className="size-10 rounded-full border border-gh-border object-cover"
              alt={profile.name}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-gh-text truncate">
                {profile.name}
              </span>
              <span className="text-[12px] text-gh-text-secondary truncate">
                {profile.username || "TrackCodex User"}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined !text-[18px] text-gh-text-secondary group-hover:text-gh-text transition-colors">
            sync_alt
          </span>
        </div>
      </div>

      <div className="px-1 space-y-0.5">
        {/* Status */}
        <button
          onClick={() => handleNavigate("/settings/profile")}
          className="w-full flex items-center gap-3 px-3 py-1.5 text-[13px] text-gh-text-secondary hover:text-blue-400 group transition-colors border border-transparent hover:border-gh-border/50 rounded-lg mx-2 w-[calc(100%-16px)]"
        >
          <span className="text-[16px] group-hover:scale-110 transition-transform">
            {profile.techStatus?.emoji || "😊"}
          </span>
          <span className="truncate flex-1 text-left">
            {profile.techStatus?.text || "Set status"}
          </span>
        </button>

        <div className="h-px bg-gh-border my-2 mx-3"></div>

        {/* Section 1 */}
        <MenuItem
          icon="person"
          label="Your profile"
          onClick={() => handleNavigate("/profile")}
        />
        <MenuItem
          icon="account_tree"
          label="Your repositories"
          onClick={() => handleNavigate("/repositories")}
        />
        <MenuItem
          icon="military_tech"
          label="Level"
          onClick={() => handleNavigate("/leaderboard")}
        />
        <MenuItem
          icon="work"
          label="Portfolio"
          onClick={() => handleNavigate("/portfolio")}
        />
        <MenuItem
          icon="corporate_fare"
          label="StrataHub"
          onClick={() => handleNavigate("/strata")}
        />
        <MenuItem
          icon="favorite"
          label="TrackCoin"
          onClick={() => handleNavigate("/community")}
        />
        <MenuItem
          icon="inventory_2"
          label="TaskVault"
          onClick={() => handleNavigate("/taskvault")}
        />

        <div className="h-px bg-gh-border my-2 mx-3"></div>

        {/* Section 2 */}
        <MenuItem
          icon="settings"
          label="Settings"
          onClick={() => handleNavigate("/settings")}
        />
        <MenuItem
          icon="science"
          label="Feature preview"
          onClick={() => handleNavigate("/overview")}
          badge="New"
          badgeColor="text-blue-400 border-blue-500/30"
        />
        <MenuItem
          icon="palette"
          label="Appearance"
          onClick={() => handleNavigate("/settings/appearance")}
        />
        <MenuItem
          icon="accessibility_new"
          label="Accessibility"
          onClick={() => handleNavigate("/settings/accessibility")}
        />
        {!enterprises.some((e) => e.slug === "acme") && (
          <MenuItem
            icon="rocket_launch"
            label="Try Strata"
            onClick={() => handleNavigate("/network/acme")}
            badge="Free"
            badgeColor="text-amber-400 border-amber-500/30"
          />
        )}

        <div className="h-px bg-gh-border my-2 mx-3"></div>

        {/* Section 3 */}
        <MenuItem icon="logout" label="Sign out" onClick={logout} />
      </div>
    </div>
  );
};

export default UserProfileDropdown;
