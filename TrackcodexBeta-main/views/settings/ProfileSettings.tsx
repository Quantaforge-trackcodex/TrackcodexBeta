import React, { useState, useEffect, useRef } from "react";
import { profileService, UserProfile } from "../../services/profile";
import { useAuth } from "../../context/AuthContext";
import { locationService, LocationError } from "../../services/location";

// Reusable component for settings sections
const SettingsSection = ({
  title,
  description,
  children,
}: React.PropsWithChildren<{ title: string; description: string }>) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gh-border first:pt-0 first:border-0">
    <div className="md:col-span-1">
      <h3 className="text-lg font-bold text-gh-text">{title}</h3>
      <p className="text-sm text-gh-text-secondary mt-1">{description}</p>
    </div>
    <div className="md:col-span-2 bg-gh-bg-secondary border border-gh-border rounded-xl p-6 space-y-6 shadow-sm">
      {children}
    </div>
  </section>
);

const ProfileSettings = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() =>
    profileService.getProfile(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync with service if it changes elsewhere, though unlikely in this flow.
    return profileService.subscribe(setProfile);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    profileService.updateProfile(profile);
    setTimeout(() => {
      setIsSaving(false);
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "Profile Updated",
            message: "Your public profile has been saved.",
            type: "success",
          },
        }),
      );
    }, 1000);
  };

  const handleGPSToggle = async () => {
    if (profile.useGPSLocation) {
      // Disable GPS
      profileService.disableGPSLocation();
      setProfile({ ...profile, useGPSLocation: false });
      setLocationError(null);
    } else {
      // Enable GPS
      await handleRefreshLocation();
    }
  };

  const handleRefreshLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const locationData = await locationService.getCurrentLocation();
      profileService.updateGPSLocation(
        locationData.latitude,
        locationData.longitude,
        locationData.address,
      );
      setProfile({
        ...profile,
        useGPSLocation: true,
        gpsLocation: locationData.address,
        location: locationData.address,
        gpsLatitude: locationData.latitude,
        gpsLongitude: locationData.longitude,
        gpsLastUpdated: locationData.timestamp,
      });
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            id: `gps-${Date.now()}`,
            title: "Location Updated",
            message: `Your location has been set to ${locationData.address}`,
            type: "info",
            createdAt: new Date().toISOString(),
            read: false,
          },
        }),
      );
    } catch (error) {
      const err = error as LocationError;
      setLocationError(err.message);
      setProfile({ ...profile, useGPSLocation: false });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="border-b border-gh-border pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gh-text tracking-tight">
            Public Profile
          </h1>
          <p className="text-sm text-gh-text-secondary mt-1 leading-relaxed">
            This is how others will see you on the platform. Customize your
            public presence.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gh-bg-secondary hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/50 border border-gh-border text-gh-text rounded-lg text-xs font-bold transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined !text-[16px]">logout</span>
          Sign Out
        </button>
      </header>

      <SettingsSection
        title="Avatar"
        description="Your profile picture. Recommended size is 400x400px."
      >
        <div className="flex items-center gap-6">
          <img
            src={profile.avatar}
            className="size-24 rounded-full border-2 border-gh-border"
            alt="Avatar Preview"
          />
          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
              aria-label="Upload avatar image"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text hover:bg-gh-border rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              Upload new picture
            </button>
            <p className="text-xs text-gh-text-secondary mt-2">
              Will be updated on save.
            </p>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Profile Details"
        description="Basic information about you."
      >
        <div>
          <label
            htmlFor="profile-name"
            className="text-xs font-bold text-gh-text-secondary"
          >
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-gh-text focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="profile-username"
            className="text-xs font-bold text-gh-text-secondary"
          >
            Username
          </label>
          <input
            id="profile-username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-gh-text focus:ring-1 focus:ring-primary outline-none"
          />
          <p className="mt-2 text-xs text-gh-text-secondary">
            Changing your username can have{" "}
            <span className="text-rose-500 font-medium">
              unintended side effects
            </span>
            .
          </p>
        </div>
        <div>
          <label
            htmlFor="profile-bio"
            className="text-xs font-bold text-gh-text-secondary"
          >
            Bio
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-gh-text focus:ring-1 focus:ring-primary outline-none h-24 resize-none"
            placeholder="Tell us a little about yourself"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Professional Info"
        description="Links and details about your work."
      >
        <div>
          <label
            htmlFor="profile-company"
            className="text-xs font-bold text-gh-text-secondary"
          >
            Company
          </label>
          <input
            id="profile-company"
            name="company"
            value={profile.company}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-gh-text"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="profile-location"
              className="text-xs font-bold text-gh-text-secondary"
            >
              Location
            </label>
            <button
              type="button"
              onClick={handleGPSToggle}
              disabled={isLoadingLocation}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${profile.useGPSLocation
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-gh-bg border border-gh-border text-gh-text hover:bg-gh-bg-secondary"
                } ${isLoadingLocation ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoadingLocation ? (
                <>
                  <span className="material-symbols-outlined !text-[14px] animate-spin">
                    progress_activity
                  </span>
                  Getting location...
                </>
              ) : profile.useGPSLocation ? (
                <>
                  <span className="material-symbols-outlined !text-[14px]">
                    my_location
                  </span>
                  GPS Enabled
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined !text-[14px]">
                    location_searching
                  </span>
                  Use GPS
                </>
              )}
            </button>
          </div>
          <input
            id="profile-location"
            name="location"
            value={profile.location}
            onChange={handleChange}
            disabled={profile.useGPSLocation}
            className={`mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-gh-text ${profile.useGPSLocation ? "opacity-60 cursor-not-allowed" : ""
              }`}
            placeholder="City, State, Country"
          />
          {profile.useGPSLocation && profile.gpsLastUpdated && (
            <p className="mt-2 text-xs text-gh-text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined !text-[12px]">
                schedule
              </span>
              Last updated: {new Date(profile.gpsLastUpdated).toLocaleString()}
            </p>
          )}
          {locationError && (
            <p className="mt-2 text-xs text-rose-500 flex items-center gap-1">
              <span className="material-symbols-outlined !text-[12px]">
                error
              </span>
              {locationError}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">
            Website
          </label>
          <div className="flex items-center mt-1">
            <span className="px-3 py-2 bg-gh-bg border border-r-0 border-gh-border rounded-l-lg text-sm text-gh-text-secondary">
              https://
            </span>
            <input
              id="profile-website"
              name="website"
              value={profile.website}
              onChange={handleChange}
              // Adding aria-label since visual label is above container
              aria-label="Website"
              className="w-full bg-gh-bg border border-gh-border rounded-r-lg px-3 py-2 text-sm text-gh-text"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">
            LinkedIn
          </label>
          <div className="flex items-center mt-1">
            <span className="px-3 py-2 bg-gh-bg border border-r-0 border-gh-border rounded-l-lg text-sm text-gh-text-secondary">
              linkedin.com/
            </span>
            <input
              name="linkedinUrl"
              value={profile.linkedinUrl || ""}
              onChange={handleChange}
              aria-label="LinkedIn Username"
              className="w-full bg-gh-bg border border-gh-border rounded-r-lg px-3 py-2 text-sm text-gh-text"
              placeholder="in/username"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">
            Reddit
          </label>
          <div className="flex items-center mt-1">
            <span className="px-3 py-2 bg-gh-bg border border-r-0 border-gh-border rounded-l-lg text-sm text-gh-text-secondary">
              reddit.com/
            </span>
            <input
              name="redditUrl"
              value={profile.redditUrl || ""}
              onChange={handleChange}
              aria-label="Reddit Username"
              className="w-full bg-gh-bg border border-gh-border rounded-r-lg px-3 py-2 text-sm text-gh-text"
              placeholder="u/username"
            />
          </div>
        </div>
      </SettingsSection>

      <div className="pt-8 border-t border-gh-border flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving && (
            <span className="material-symbols-outlined animate-spin !text-[16px]">
              progress_activity
            </span>
          )}
          {isSaving ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
