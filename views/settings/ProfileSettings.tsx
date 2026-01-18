import React, { useState, useEffect, useRef } from 'react';
import { profileService, UserProfile } from '../../services/profile';

// Reusable component for settings sections
// Fix: Changed component props to use React.PropsWithChildren to correctly type a component that accepts children. This resolves the TypeScript errors on lines 62, 81, and 106.
const SettingsSection = ({ title, description, children }: React.PropsWithChildren<{ title: string, description: string }>) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gh-border first:pt-0 first:border-0">
    <div className="md:col-span-1">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-gh-text-secondary mt-1">{description}</p>
    </div>
    <div className="md:col-span-2 bg-gh-bg-secondary border border-gh-border rounded-xl p-6 space-y-6 shadow-sm">
      {children}
    </div>
  </section>
);

const ProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile>(() => profileService.getProfile());
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Sync with service if it changes elsewhere, though unlikely in this flow.
    return profileService.subscribe(setProfile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      window.dispatchEvent(new CustomEvent('trackcodex-notification', {
        detail: { title: 'Profile Updated', message: 'Your public profile has been saved.', type: 'success' }
      }));
    }, 1000);
  };

  return (
    <div className="space-y-10">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Public Profile</h1>
        <p className="text-sm text-gh-text-secondary mt-1 leading-relaxed">
          This is how others will see you on the platform. Customize your public presence.
        </p>
      </header>

      <SettingsSection
        title="Avatar"
        description="Your profile picture. Recommended size is 400x400px."
      >
        <div className="flex items-center gap-6">
          <img src={profile.avatar} className="size-24 rounded-full border-2 border-gh-border" alt="Avatar Preview" />
          <div className="flex-1">
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#21262d] border border-gh-border text-gh-text hover:bg-[#30363d] rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              Upload new picture
            </button>
            <p className="text-xs text-gh-text-secondary mt-2">Will be updated on save.</p>
          </div>
        </div>
      </SettingsSection>
      
      <SettingsSection
        title="Profile Details"
        description="Basic information about you."
      >
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">Username</label>
          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
          />
           <p className="mt-2 text-xs text-gh-text-secondary">
             Changing your username can have <span className="text-rose-500 font-medium">unintended side effects</span>.
           </p>
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none h-24 resize-none"
            placeholder="Tell us a little about yourself"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Professional Info"
        description="Links and details about your work."
      >
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">Company</label>
          <input name="company" value={profile.company} onChange={handleChange} className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">Location</label>
          <input name="location" value={profile.location} onChange={handleChange} className="mt-1 w-full bg-gh-bg border border-gh-border rounded-lg px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label className="text-xs font-bold text-gh-text-secondary">Website</label>
          <div className="flex items-center mt-1">
            <span className="px-3 py-2 bg-gh-bg border border-r-0 border-gh-border rounded-l-lg text-sm text-gh-text-secondary">https://</span>
            <input name="website" value={profile.website} onChange={handleChange} className="w-full bg-gh-bg border border-gh-border rounded-r-lg px-3 py-2 text-sm text-white" />
          </div>
        </div>
      </SettingsSection>

      <div className="pt-8 border-t border-gh-border flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving && <span className="material-symbols-outlined animate-spin !text-[16px]">progress_activity</span>}
          {isSaving ? 'Saving...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;