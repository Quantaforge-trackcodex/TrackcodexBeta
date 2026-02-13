import React, { useState, useEffect, useRef } from "react";
import { profileService, UserProfile } from "../../services/profile";
import { useAuth } from "../../context/AuthContext";
import { locationService, LocationError } from "../../services/location";
import { detectSocialPlatform } from "../../utils/socialMediaDetector";

const ProfileSettings = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() =>
    profileService.getProfile(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync with service
    const unsubscribe = profileService.subscribe(setProfile);

    // Update local time clock every second
    const interval = setInterval(() => {
      if (profile.timezone) {
        try {
          const timeString = new Date().toLocaleTimeString("en-US", {
            timeZone: profile.timezone,
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short"
          });
          setCurrentTime(timeString);
        } catch (e) {
          // Fallback if timezone is invalid
          setCurrentTime(new Date().toLocaleTimeString());
        }
      } else {
        // Default to system time if no timezone set yet
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [profile.timezone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      let updates: any = { [name]: checked };

      // If enabling local time, auto-detect timezone if missing
      if (name === "displayLocalTime" && checked && !profile.timezone) {
        const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        updates.timezone = detectedZone;
      }

      setProfile({ ...profile, ...updates });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...(profile.socialLinks || ["", "", "", ""])];
    newLinks[index] = value;
    setProfile({ ...profile, socialLinks: newLinks });
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

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    try {
      const locationData = await locationService.getCurrentLocation();
      const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setProfile({
        ...profile,
        location: locationData.address,
        gpsLatitude: locationData.latitude,
        gpsLongitude: locationData.longitude,
        useGPSLocation: true,
        timezone: detectedZone // Auto-update timezone with location
      });

      // Dispatch silent notification to bell
      window.dispatchEvent(
        new CustomEvent("trackcodex-realtime-notification", {
          detail: {
            id: `loc-update-${Date.now()}`,
            title: "Location Updated",
            message: `Set to: ${locationData.city || locationData.address}`,
            type: "info",
            createdAt: new Date().toISOString(),
            read: false,
            skipToast: true // Key change: Suppress popup
          },
        }),
      );

    } catch (error: any) {
      setLocationError(error.message || "Failed to get location");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    profileService.updateProfile(profile);
    setTimeout(() => {
      setIsSaving(false);
      window.dispatchEvent(
        new CustomEvent("trackcodex-realtime-notification", {
          detail: {
            id: `prof-update-${Date.now()}`,
            title: "Profile Updated",
            message: "Your public profile has been updated.",
            type: "info",
            createdAt: new Date().toISOString(),
            read: false,
            skipToast: true // Key change: Suppress popup
          },
        }),
      );
    }, 800);
  };

  // Helper Styles
  const labelStyle = "block text-sm font-semibold text-white mb-2";
  const inputStyle = "w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors placeholder-[#484f58]";
  const sectionTitleStyle = "text-xl font-normal text-white pb-2 border-b border-[#30363d] mb-4";

  return (
    <div className="max-w-[1000px] text-[#c9d1d9]">
      <h1 className="text-3xl font-normal text-white mb-2">Public profile</h1>
      <div className="border-b border-[#30363d] mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="md:col-span-8 space-y-6">

          <div>
            <label htmlFor="name" className={labelStyle}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className={inputStyle}
            />
            <p className="text-xs text-[#8b949e] mt-1">Your name may appear around TrackCodex where you contribute or are mentioned. You can remove it at any time.</p>
          </div>

          <div>
            <label htmlFor="publicEmail" className={labelStyle}>Public email</label>
            <div className="flex gap-2">
              <select
                id="publicEmail"
                name="publicEmail"
                value={profile.publicEmail || ""}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Select a verified email to display</option>
                {profile.email && <option value={profile.email}>{profile.email}</option>}
                <option value="private">Don't show my email</option>
              </select>
            </div>
            <p className="text-xs text-[#8b949e] mt-1">You can manage verified email addresses in your <a href="#" className="text-blue-400 hover:underline">email settings</a>.</p>
          </div>

          <div>
            <label htmlFor="bio" className={labelStyle}>Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className={`${inputStyle} min-h-[100px] resize-y`}
              placeholder="Tell us a little bit about yourself"
            />
            <p className="text-xs text-[#8b949e] mt-1">You can <strong>@mention</strong> other users and organizations to link to them.</p>
          </div>

          <div>
            <label htmlFor="pronouns" className={labelStyle}>Pronouns</label>
            <select
              id="pronouns"
              name="pronouns"
              value={profile.pronouns || "Don't specify"}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="Don't specify">Don't specify</option>
              <option value="they/them">they/them</option>
              <option value="she/her">she/her</option>
              <option value="he/him">he/him</option>
              <option value="custom">Custom...</option>
            </select>
          </div>

          <div>
            <label htmlFor="website" className={labelStyle}>URL</label>
            <input
              type="text"
              id="website"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className={labelStyle}>Social accounts</label>
            <p className="text-xs text-[#8b949e] mb-3">
              Paste your social media profile URLs and we'll automatically detect the platform
            </p>
            <div className="space-y-2">
              {(profile.socialLinks || ["", "", "", ""]).map((link, idx) => {
                const platform = link ? detectSocialPlatform(link) : null;

                return (
                  <div key={idx} className="relative">
                    <span className={`absolute left-3 top-2 ${platform ? platform.color : "text-[#8b949e]"}`}>
                      <span className="material-symbols-outlined !text-[16px]">
                        {platform ? platform.icon : "link"}
                      </span>
                    </span>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => handleSocialLinkChange(idx, e.target.value)}
                      className={`${inputStyle} pl-9`}
                      placeholder={`Link to social profile ${idx + 1}`}
                    />
                    {platform && (
                      <span className="absolute right-3 top-2 text-xs text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
                        {platform.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="company" className={labelStyle}>Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={profile.company}
              onChange={handleChange}
              className={inputStyle}
            />
            <p className="text-xs text-[#8b949e] mt-1">You can <strong>@mention</strong> your company's TrackCodex organization to link it.</p>
          </div>

          <div>
            <label htmlFor="location" className={labelStyle}>Location</label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className={`${inputStyle} pr-10`}
                placeholder="City, Country"
              />
              <button
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                title="Use current location"
                className="absolute right-2 top-1.5 p-1 text-[#8b949e] hover:text-blue-400 disabled:opacity-50 transition-colors"
              >
                <span className={`material-symbols-outlined !text-[18px] ${isLoadingLocation ? "animate-spin" : ""}`}>
                  {isLoadingLocation ? "progress_activity" : "my_location"}
                </span>
              </button>
            </div>
            {locationError && (
              <p className="text-xs text-rose-500 mt-1">{locationError}</p>
            )}
            <p className="text-xs text-[#8b949e] mt-1">Click the <span className="material-symbols-outlined !text-[12px] align-text-bottom">my_location</span> icon to use your current GPS location.</p>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="displayLocalTime"
              name="displayLocalTime"
              checked={profile.displayLocalTime || false}
              onChange={handleChange}
              className="mt-1 bg-[#0d1117] border-[#30363d] rounded text-blue-500 focus:ring-0"
            />
            <div>
              <label htmlFor="displayLocalTime" className="text-sm font-semibold text-white flex items-center gap-2">
                Display current local time
                {profile.displayLocalTime && (
                  <span className="text-xs font-normal text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded-full border border-[#30363d]">
                    {currentTime} (Live Preview)
                  </span>
                )}
              </label>
              <p className="text-xs text-[#8b949e]">Other users will see the time difference from their local time.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d]">
            <h3 className="font-semibold text-white mb-2">ORCID ID</h3>
            <p className="text-xs text-[#8b949e] mb-3">ORCID provides a persistent identifier - an ORCID iD - that distinguishes you from other researchers. Learn more at <a href="#" className="text-blue-400 hover:underline">ORCID.org</a>.</p>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-semibold text-[#c9d1d9] transition-colors">
              <span className="w-4 h-4 rounded-full bg-[#a6ce39] flex items-center justify-center text-[10px] text-white font-bold">iD</span>
              Connect your ORCID iD
            </button>
          </div>

          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-[#1f6feb] hover:bg-[#1a5cbf] text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isSaving ? "Update profile..." : "Update profile"}
            </button>
          </div>

        </div>

        {/* Right Column: Avatar */}
        <div className="md:col-span-4 pl-0 md:pl-8">
          <h3 className="text-sm font-semibold text-white mb-2">Profile picture</h3>
          <div className="relative group w-fit">
            <img
              src={profile.avatar}
              alt="Profile"
              className="size-48 rounded-full border border-[#30363d]"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 left-0 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined !text-[14px]">edit</span>
              Edit
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="mt-12 space-y-10">

        {/* Contributions */}
        <section>
          <h2 className={sectionTitleStyle}>Contributions & activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 bg-[#0d1117] border-[#30363d] rounded text-blue-500 focus:ring-0" />
              <div>
                <label className="text-sm font-semibold text-white">Make profile private and hide activity</label>
                <p className="text-xs text-[#8b949e]">Enabling this will hide your contributions and activity from your TrackCodex profile and from social features like followers, stars, feeds, leaderboards and releases.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" defaultChecked className="mt-1 bg-[#0d1117] border-[#30363d] rounded text-blue-500 focus:ring-0" />
              <div>
                <label className="text-sm font-semibold text-white">Include private contributions on my profile</label>
                <p className="text-xs text-[#8b949e]">Your contribution graph, achievements, and activity overview will show your private contributions without revealing any repository or organization information. <a href="#" className="text-blue-400 hover:underline">Read more</a>.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-semibold text-[#c9d1d9] transition-colors mt-2">
              Update preferences
            </button>
          </div>
        </section>

        {/* Profile Settings */}
        <section>
          <h2 className={sectionTitleStyle}>Profile settings</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <input type="checkbox" defaultChecked className="mt-1 bg-[#0d1117] border-[#30363d] rounded text-blue-500 focus:ring-0" />
              <div>
                <label className="text-sm font-semibold text-white">Show Achievements on my profile</label>
                <p className="text-xs text-[#8b949e]">Your achievements will be shown on your profile.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-semibold text-[#c9d1d9] transition-colors mt-2">
              Update preferences
            </button>
          </div>
        </section>

        {/* TrackCodex Developer Program */}
        <section>
          <h2 className={sectionTitleStyle}>TrackCodex Developer Program</h2>
          <div className="p-4 border border-[#30363d] rounded-md bg-[#0d1117]">
            <p className="text-sm text-white">
              Building an application, service, or tool that integrates with TrackCodex? <a href="#" className="text-blue-400 hover:underline">Join the TrackCodex Developer Program</a>, or read more about it at our <a href="#" className="text-blue-400 hover:underline">developer program</a>.
            </p>
          </div>
        </section>

        {/* Jobs Profile */}
        <section>
          <h2 className={sectionTitleStyle}>Jobs profile</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 bg-[#0d1117] border-[#30363d] rounded text-blue-500 focus:ring-0" />
              <div>
                <label className="text-sm font-semibold text-white">Available for hire</label>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-semibold text-[#c9d1d9] transition-colors mt-2">
              Save jobs profile
            </button>
          </div>
        </section>

        {/* Trending Settings */}
        <section>
          <h2 className={sectionTitleStyle}>Trending settings</h2>
          <div className="space-y-4">
            <div>
              <label className={labelStyle}>Preferred spoken language</label>
              <select className={inputStyle}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <p className="text-xs text-[#8b949e]">We'll use this language preference to filter the trending repository lists on <a href="#" className="text-blue-400 hover:underline">Explore</a> our <a href="#" className="text-blue-400 hover:underline">Trending Repositories</a> page.</p>
            <button className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-semibold text-[#c9d1d9] transition-colors mt-2">
              Save Trending settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
