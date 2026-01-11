
import React, { useState, useRef, useEffect } from 'react';
import { profileService, UserProfile } from '../../services/profile';
import { directMessageBus } from '../../services/directMessageBus';
import OfferJobModal from '../jobs/offer/OfferJobModal';

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const [followerCount, setFollowerCount] = useState(2402);

  useEffect(() => {
    return profileService.subscribe((updated) => {
      setProfile(updated);
    });
  }, []);

  useEffect(() => {
    if (isEditing && bioRef.current) {
      bioRef.current.focus();
      const length = bioRef.current.value.length;
      bioRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = () => {
    profileService.updateProfile({
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      website: profile.website,
      avatar: profile.avatar
    });
    setIsEditing(false);
  };

  const toggleFollow = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    setFollowerCount(prev => newFollowingState ? prev + 1 : prev - 1);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMessageClick = () => {
    directMessageBus.openChat({
      id: profile.username,
      name: profile.name,
      avatar: profile.avatar
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setProfile(prev => ({ ...prev, avatar: base64Data }));
        profileService.updateProfile({ avatar: base64Data });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatCount = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <>
      <aside className="w-full lg:w-[296px] shrink-0 font-display">
        <div className="relative mb-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <div 
            onClick={handleAvatarClick}
            className="aspect-square w-full rounded-full border-4 border-[#30363d] overflow-hidden shadow-2xl relative group cursor-pointer"
            title="Click to change profile picture"
          >
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="size-full object-cover transition-transform group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white !text-3xl mb-1">photo_camera</span>
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Change Photo</span>
            </div>
          </div>
          <div className="absolute bottom-[10%] right-[10%] size-10 bg-[#161b22] rounded-full flex items-center justify-center border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-all shadow-xl z-10 group/emoji">
            <span className="material-symbols-outlined text-slate-400 group-hover/emoji:text-white !textxl">emoji_emotions</span>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 mb-6">
            <input 
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="Display Name"
            />
            <input 
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-slate-400 focus:ring-1 focus:ring-primary outline-none"
              value={profile.username}
              onChange={(e) => setProfile({...profile, username: e.target.value})}
              placeholder="Username"
            />
          </div>
        ) : (
          <div className="mb-6">
            <h1 className="text-[26px] font-black text-[#f0f6fc] leading-tight tracking-tight">{profile.name}</h1>
            <p className="text-[20px] text-slate-500 font-medium">{profile.username}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">Security-First Dev</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">ForgeAI Power User</span>
        </div>

        <div className="flex items-center gap-4 mb-6 text-[14px] text-slate-400">
          <div className="flex items-center gap-1 group">
            <span className="material-symbols-outlined !text-[18px] text-slate-500 group-hover:text-primary">group</span>
            <span className="font-bold text-[#f0f6fc]">{formatCount(followerCount)}</span>
            <span>followers</span>
          </div>
          <div className="flex items-center gap-1 group">
            <span className="font-bold text-[#f0f6fc]">{formatCount(profile.following || 180)}</span>
            <span>following</span>
          </div>
        </div>

        {isEditing ? (
          <textarea 
            ref={bioRef}
            className="w-full bg-[#0d1117] border border-primary rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none h-28 resize-none mb-6"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="Write a short bio..."
          />
        ) : (
          <p className="text-[14px] text-[#c9d1d9] leading-relaxed mb-6 cursor-pointer hover:bg-white/5 rounded p-1 transition-colors" onClick={() => setIsEditing(true)}>
            {profile.bio}
          </p>
        )}

        <div className="flex flex-col gap-3 mb-8">
          {!isEditing ? (
            <>
              <button 
                onClick={toggleFollow}
                className={`w-full py-2 rounded-lg font-bold text-sm transition-all shadow-lg border border-white/5 flex items-center justify-center gap-2 ${isFollowing ? 'bg-[#21262d] text-slate-200' : 'bg-primary text-white shadow-primary/20'}`}
              >
                <span className="material-symbols-outlined !text-[18px]">{isFollowing ? 'person_remove' : 'person_add'}</span>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleMessageClick}
                  className="py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm font-bold text-[#c9d1d9] hover:bg-[#21262d] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined !text-[18px]">mail</span> Message
                </button>
                <button 
                  onClick={() => setIsOfferModalOpen(true)}
                  className="py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm font-black text-amber-500 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined !text-[18px]">work</span> Offer Job
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={handleSave} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-500/10">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="w-full py-2 bg-transparent border border-[#30363d] rounded-lg text-sm font-bold text-[#c9d1d9] hover:bg-[#21262d] transition-colors">Cancel</button>
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-sm text-[#8b949e] mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined !text-[18px]">corporate_fare</span>
            <span className="font-semibold text-[#c9d1d9]">{profile.company}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined !text-[18px]">location_on</span>
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined !text-[18px]">link</span>
            <span className="text-[#58a6ff] hover:underline">{profile.website}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined !text-[18px] text-amber-500 filled">star</span>
            <span className="font-bold text-[#c9d1d9]">{profile.rating}/5</span>
          </div>
        </div>
      </aside>

      <OfferJobModal 
        isOpen={isOfferModalOpen} 
        onClose={() => setIsOfferModalOpen(false)} 
        targetUser={{ name: profile.name, username: profile.username }} 
      />
    </>
  );
};

export default ProfileCard;
