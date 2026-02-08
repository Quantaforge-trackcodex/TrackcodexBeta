
import React from 'react';
import KarmaBadge from './KarmaBadge';

interface UserHoverCardProps {
  user: {
    name: string;
    username: string;
    avatar: string;
    role?: string;
    karma: number;
    bio?: string;
  };
}

const UserHoverCard: React.FC<UserHoverCardProps> = ({ user }) => {
  return (
    <div className="absolute z-50 w-72 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
      <div className="flex items-start justify-between mb-4">
        <img src={user.avatar} alt={user.name} className="size-14 rounded-full border-2 border-primary/20 object-cover" />
        <KarmaBadge karma={user.karma} />
      </div>

      <div className="mb-4">
        <h4 className="text-base font-black text-white leading-tight">{user.name}</h4>
        <p className="text-xs text-slate-500 font-medium">@{user.username}</p>
        {user.role && (
          <p className="text-[10px] font-black uppercase text-primary mt-1 tracking-widest">{user.role}</p>
        )}
      </div>

      <p className="text-[12px] text-slate-400 leading-relaxed mb-4 line-clamp-2">
        {user.bio || 'Enterprise engineer at TrackCodex Security. Focused on high-fidelity system design.'}
      </p>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#30363d]">
        <div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Karma</p>
          <p className="text-sm font-black text-white">{user.karma}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Following</p>
          <p className="text-sm font-black text-white">1.2k</p>
        </div>
      </div>

      <button className="w-full mt-4 py-2 bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">
        View Full Profile
      </button>
    </div>
  );
};

export default UserHoverCard;
