import React, { useState, useEffect, useRef } from 'react';
import { profileService, UserProfile, TechStatus } from '../../services/profile';
import { directMessageBus } from '../../services/directMessageBus';
import OfferJobModal from '../jobs/offer/OfferJobModal';

const PRESET_STATUSES = [
  { emoji: '🚀', text: 'Scaling core-api shards' },
  { emoji: '🛡️', text: 'Hardening security protocols' },
  { emoji: '🤖', text: 'Training ForgeAI weights' },
  { emoji: '⚡', text: 'Optimizing hot paths' },
  { emoji: '🔍', text: 'Hunting memory leaks' },
  { emoji: '🏗️', text: 'Refactoring architecture' },
];

const TechStatusEditor = ({ current, onSave, onCancel }: { current?: TechStatus, onSave: (s: TechStatus | null) => void, onCancel: () => void }) => {
  const [emoji, setEmoji] = useState(current?.emoji || '💬');
  const [text, setText] = useState(current?.text || '');
  const [expiry, setExpiry] = useState<string>('never');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  const handleSave = () => {
    if (!text.trim()) {
      onSave(null);
      return;
    }
    let expiresAt: number | undefined;
    if (expiry === '1h') expiresAt = Date.now() + 3600000;
    if (expiry === '1d') expiresAt = Date.now() + 86400000;
    
    onSave({ emoji, text: text.trim(), expiresAt });
  };

  return (
    <div className="absolute top-0 left-0 w-full z-[200] animate-in fade-in zoom-in-95 duration-200">
      <div ref={modalRef} className="bg-[#161b22] border border-primary/40 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        <div className="flex items-center justify-between mb-4">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Update Tech Status</h4>
           <button onClick={onCancel} className="text-slate-600 hover:text-white transition-colors">
              <span className="material-symbols-outlined !text-[18px]">close</span>
           </button>
        </div>

        <div className="flex gap-2 mb-4 bg-[#0d1117] p-2 rounded-xl border border-[#30363d]">
          <div className="size-10 bg-[#161b22] rounded-lg flex items-center justify-center text-xl shrink-0 border border-white/5">
            {emoji}
          </div>
          <input 
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's your current focus?"
            className="flex-1 bg-transparent border-none text-sm text-slate-200 focus:ring-0 outline-none placeholder:text-slate-600"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="mb-4">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">Presets</p>
           <div className="grid grid-cols-2 gap-2">
              {PRESET_STATUSES.map(p => (
                <button 
                  key={p.text}
                  onClick={() => { setEmoji(p.emoji); setText(p.text); }}
                  className="flex items-center gap-2 px-2 py-1.5 bg-[#0d1117] border border-[#30363d] hover:border-primary/50 rounded-lg text-left transition-all group"
                >
                   <span className="text-sm">{p.emoji}</span>
                   <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200 truncate">{p.text}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="flex items-center justify-between mb-5 px-1">
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined !text-[16px] text-slate-500">schedule</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Clear after</span>
           </div>
           <select 
              value={expiry} 
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none focus:ring-1 focus:ring-primary"
           >
              <option value="never">Never</option>
              <option value="1h">1 Hour</option>
              <option value="1d">1 Day</option>
           </select>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={handleSave} 
             className="flex-1 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95"
           >
             Set Status
           </button>
           {current && (
             <button 
               onClick={() => onSave(null)} 
               className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
             >
               Clear
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const ProfileCard = () => {
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tempBio, setTempBio] = useState(profile.bio);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return profileService.subscribe(setProfile);
  }, []);

  const handleSaveBio = () => {
    profileService.updateProfile({ bio: tempBio });
    setIsEditingBio(false);
  };

  const handleStatusSave = (newStatus: TechStatus | null) => {
    profileService.updateProfile({ techStatus: newStatus || undefined });
    setIsEditingStatus(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        profileService.updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMessage = () => {
    directMessageBus.openChat({
      id: profile.username,
      name: profile.name,
      avatar: profile.avatar,
      context: "Direct collaboration inquiry"
    });
  };

  const toggleFollow = () => {
    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    profileService.updateProfile({ followers: profile.followers + (nextFollowing ? 1 : -1) });
  };

  return (
    <div className="font-display group/sidebar relative">
      {/* Avatar Section */}
      <div className="aspect-square w-full rounded-full border-4 border-[#30363d] overflow-hidden mb-8 shadow-2xl relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <img src={profile.avatar} className="size-full object-cover group-hover/avatar:scale-105 transition-transform duration-700" alt={profile.name} />
        
        {/* Presence Indicator */}
        <div className="absolute bottom-8 right-8 size-5 bg-emerald-500 rounded-full border-4 border-[#0d1117] shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"></div>

        {/* Floating Mini Status - Emoji on Avatar */}
        {profile.techStatus && (
           <div 
            onClick={(e) => { e.stopPropagation(); setIsEditingStatus(true); }}
            className="absolute top-6 left-6 size-10 rounded-2xl bg-[#0d1117]/80 backdrop-blur-md border border-primary/40 flex items-center justify-center text-xl shadow-2xl animate-in zoom-in duration-300 hover:scale-110 transition-transform z-30"
            title={profile.techStatus.text}
           >
              {profile.techStatus.emoji}
           </div>
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
           <span className="material-symbols-outlined text-white !text-4xl">photo_camera</span>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
      </div>

      {/* Identity Info */}
      <div className="mb-6 px-1 relative">
        {isEditingStatus && (
          <TechStatusEditor 
            current={profile.techStatus} 
            onSave={handleStatusSave} 
            onCancel={() => setIsEditingStatus(false)} 
          />
        )}
        
        <h1 className="text-[34px] font-black text-white leading-tight tracking-tight uppercase mb-0.5">{profile.name}</h1>
        <p className="text-[20px] text-slate-500 font-medium mb-5">@{profile.username}</p>

        {/* Enhanced Status Badge */}
        {profile.techStatus ? (
          <div 
            className="group/status mb-8 relative w-fit"
          >
            <div 
              onClick={() => setIsEditingStatus(true)}
              className="flex items-center gap-2.5 px-4 py-2 bg-[#0d1117] border-2 border-[#135bec]/40 rounded-2xl hover:border-primary transition-all cursor-pointer shadow-lg"
            >
              <span className="text-lg">{profile.techStatus.emoji}</span>
              <span className="text-[14px] font-bold text-slate-100 truncate max-w-[220px]">
                {profile.techStatus.text}
              </span>
            </div>
            <button 
              onClick={() => profileService.updateProfile({ techStatus: undefined })}
              className="absolute -top-2 -right-2 size-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/status:opacity-100 transition-all hover:scale-110 shadow-lg z-10"
              title="Clear status"
            >
               <span className="material-symbols-outlined !text-[14px] font-black">close</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditingStatus(true)}
            className="text-[11px] font-black uppercase text-primary tracking-widest hover:underline mb-8 flex items-center gap-2 transition-all hover:translate-x-1"
          >
            <span className="material-symbols-outlined !text-base">add_circle</span>
            Set tech status
          </button>
        )}

        {/* Refined Tags */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <span className="px-3 py-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[11px] font-black uppercase tracking-[0.05em]">Security-First Dev</span>
          <span className="px-3 py-1.5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-[11px] font-black uppercase tracking-[0.05em]">ForgeAI Power User</span>
          <span className="px-3 py-1.5 rounded-2xl border border-purple-400/20 bg-purple-400/5 text-purple-400 text-[11px] font-black uppercase tracking-[0.05em]">Mentor</span>
        </div>

        {/* Social Stats */}
        <div className="flex items-center gap-8 mb-8 px-1">
           <div className="flex items-baseline gap-2 group cursor-pointer">
              <span className="text-[18px] font-black text-white group-hover:text-primary transition-colors">{profile.followers}</span>
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">followers</span>
           </div>
           <div className="flex items-baseline gap-2 group cursor-pointer">
              <span className="text-[18px] font-black text-white group-hover:text-primary transition-colors">{profile.following}</span>
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">following</span>
           </div>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-[#30363d] w-full mb-8 opacity-50"></div>

        {/* Enhanced Bio */}
        <div className="relative group/bio">
          {isEditingBio ? (
            <div className="space-y-3">
              <textarea 
                autoFocus
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full bg-[#0d1117] border border-primary/50 rounded-xl p-4 text-[14px] text-slate-200 outline-none resize-none min-h-[100px] shadow-inner"
              />
              <div className="flex gap-2">
                 <button onClick={handleSaveBio} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all">Save</button>
                 <button onClick={() => { setIsEditingBio(false); setTempBio(profile.bio); }} className="flex-1 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="relative pr-8">
              <p className="text-[16px] text-slate-200 leading-relaxed italic font-medium">
                {profile.bio}
              </p>
              <button 
                onClick={() => setIsEditingBio(true)}
                className="absolute top-0 right-0 opacity-0 group-hover/bio:opacity-100 size-8 bg-[#161b22] border border-[#30363d] rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center shadow-lg"
              >
                <span className="material-symbols-outlined !text-[18px]">edit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interaction Buttons */}
      <div className="flex flex-col gap-3 mb-10">
        <button 
          onClick={toggleFollow}
          className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-[12px] shadow-xl transition-all flex items-center justify-center gap-2 ${
            isFollowing 
              ? 'bg-[#21262d] text-slate-200 border border-[#30363d] hover:bg-[#30363d]' 
              : 'bg-primary text-white shadow-primary/20 hover:brightness-110 active:scale-95'
          }`}
        >
           <span className="material-symbols-outlined !text-[20px]">
             {isFollowing ? 'person_check' : 'person_add'}
           </span>
           {isFollowing ? 'Following' : 'Follow'}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleMessage}
            className="py-3 bg-[#161b22] border border-[#30363d] rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-200 hover:bg-[#21262d] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined !text-[18px]">forum</span>
            Message
          </button>
          <button 
            onClick={() => setIsOfferModalOpen(true)}
            className="py-3 bg-[#161b22] border border-[#30363d] rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-200 hover:bg-[#21262d] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined !text-[18px]">work</span>
            Offer Job
          </button>
        </div>
      </div>

      {/* Metadata & Rating */}
      <div className="space-y-4 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-slate-600">corporate_fare</span>
          <span className="font-bold text-slate-300">{profile.company}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-slate-600">location_on</span>
          <span>{profile.location}</span>
        </div>
        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group cursor-pointer w-fit">
          <span className="material-symbols-outlined !text-[18px] text-slate-600 group-hover:text-primary transition-colors">link</span>
          <span className="text-primary font-bold hover:underline">{profile.website}</span>
        </a>
        <div className="flex items-center gap-3 pt-2">
          <span className="material-symbols-outlined !text-[18px] text-amber-500 filled">star</span>
          <span className="font-black text-slate-200 text-sm">{profile.rating} / 5.0 <span className="font-medium text-slate-600 ml-1">(Freelance Rating)</span></span>
        </div>
      </div>

      <OfferJobModal 
        isOpen={isOfferModalOpen} 
        onClose={() => setIsOfferModalOpen(false)} 
        targetUser={{ name: profile.name, username: profile.username }}
      />
    </div>
  );
};

export default ProfileCard;