
import React, { useState, useRef, useEffect } from 'react';

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    username: 'alexcoder',
    bio: 'Building secure distributed systems with Rust & Go. Exploring the edge of AI-assisted security auditing. 🛡️ 🤖',
    company: 'TrackCodex Security',
    location: 'Seattle, WA (UTC-8)',
    website: 'alexchen.security',
    rating: '4.9/5'
  });

  // Automatically focus the bio textarea when entering edit mode
  useEffect(() => {
    if (isEditing && bioRef.current) {
      bioRef.current.focus();
      // Move cursor to the end
      const length = bioRef.current.value.length;
      bioRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  return (
    <aside className="w-full lg:w-[296px] shrink-0 font-display">
      {/* Avatar Section */}
      <div className="relative mb-6">
        <div className="aspect-square w-full rounded-full border-4 border-[#30363d] overflow-hidden shadow-2xl relative group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/alexprofile/600" 
            alt={profile.name} 
            className="size-full object-cover transition-transform group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
        </div>
        <div className="absolute bottom-[10%] right-[10%] size-10 bg-[#161b22] rounded-full flex items-center justify-center border border-[#30363d] cursor-pointer hover:bg-[#21262d] transition-all shadow-xl z-10 group/emoji">
          <span className="material-symbols-outlined text-slate-400 group-hover/emoji:text-white !text-xl">emoji_emotions</span>
        </div>
      </div>

      {/* Identity */}
      {isEditing ? (
        <div className="space-y-3 mb-6">
          <input 
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            placeholder="Name"
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

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">Security-First Dev</span>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">ForgeAI Power User</span>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold border border-purple-400/20 bg-purple-500/10 text-purple-400">Mentor</span>
      </div>

      {/* Bio Section with Direct Click-to-Edit */}
      {isEditing ? (
        <div className="relative mb-6">
          <textarea 
            ref={bioRef}
            className="w-full bg-[#0d1117] border border-primary rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none h-28 resize-none shadow-[0_0_15px_rgba(19,91,236,0.1)]"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="Tell us about yourself..."
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
            <span className="material-symbols-outlined !text-[12px]">keyboard_return</span>
            Press Save below
          </div>
        </div>
      ) : (
        <div 
          onClick={startEditing}
          className="relative group/bio cursor-pointer mb-6 p-2 -m-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          title="Click to edit bio"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover/bio:opacity-100 transition-opacity">
            <span className="material-symbols-outlined !text-[16px] text-primary">edit</span>
          </div>
          <p className="text-[14px] text-[#c9d1d9] leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Meta Links */}
      <div className="space-y-2.5 text-sm text-[#8b949e] mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-[#8b949e]">corporate_fare</span>
          {isEditing ? (
             <input className="bg-transparent border-none p-0 text-[#c9d1d9] font-semibold focus:ring-0 w-full" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} />
          ) : (
             <span className="font-semibold text-[#c9d1d9]">{profile.company}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-[#8b949e]">location_on</span>
          {isEditing ? (
             <input className="bg-transparent border-none p-0 text-[#8b949e] focus:ring-0 w-full" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
          ) : (
             <span>{profile.location}</span>
          )}
        </div>
        <div className="flex items-center gap-3 hover:text-primary cursor-pointer transition-colors group">
          <span className="material-symbols-outlined !text-[18px] text-[#8b949e] group-hover:text-primary">link</span>
          {isEditing ? (
             <input className="bg-transparent border-none p-0 text-[#58a6ff] focus:ring-0 w-full" value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} />
          ) : (
             <span className="text-[#58a6ff] hover:underline">{profile.website}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[18px] text-amber-500 filled">star</span>
          <span className="font-bold text-[#c9d1d9]">{profile.rating} <span className="text-[#8b949e] font-normal ml-1">(Freelance Rating)</span></span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mb-10">
        {isEditing ? (
          <button 
            onClick={handleSave}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg border border-white/5"
          >
            Save Changes
          </button>
        ) : (
          <button className="w-full py-2 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-lg font-bold text-sm transition-all shadow-lg border border-white/5">
            Follow
          </button>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {isEditing ? (
            <button 
              onClick={() => setIsEditing(false)}
              className="col-span-2 py-2 bg-transparent border border-[#30363d] rounded-lg text-sm font-bold text-[#c9d1d9] hover:bg-[#21262d] transition-colors"
            >
              Cancel
            </button>
          ) : (
            <>
              <button className="py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm font-bold text-[#c9d1d9] hover:bg-[#21262d] transition-colors">
                Message
              </button>
              <button className="py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-sm font-bold text-[#c9d1d9] hover:bg-[#21262d] transition-colors">
                Offer Job
              </button>
            </>
          )}
        </div>

        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full py-1.5 mt-2 bg-transparent hover:bg-white/5 border border-[#30363d] text-slate-500 hover:text-white rounded-lg font-bold text-xs transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Badge Icons Section */}
      <div className="pt-6 border-t border-[#30363d]">
        <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-4">Badges</h3>
        <div className="flex gap-4">
          <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500" title="Security Expert">
            <span className="material-symbols-outlined !text-[18px]">security</span>
          </div>
          <div className="size-8 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400" title="ForgeAI Early Adopter">
            <span className="material-symbols-outlined !text-[18px]">auto_awesome</span>
          </div>
          <div className="size-8 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-400" title="Community Pillar">
            <span className="material-symbols-outlined !text-[18px]">groups</span>
          </div>
          <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500" title="Award Winner">
            <span className="material-symbols-outlined !text-[18px]">military_tech</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileCard;
