import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserHoverCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
    username?: string;
    bio?: string;
    followers?: number;
    postsCount?: number;
  };
}

const UserHoverCard: React.FC<UserHoverCardProps> = ({ user }) => {
  const navigate = useNavigate();

  // Generate mock stats if not provided
  const followers = user.followers || Math.floor(Math.random() * 5000) + 100;
  const postsCount = user.postsCount || Math.floor(Math.random() * 200) + 10;
  const username = user.username || user.name.toLowerCase().replace(/\s+/g, '');
  const bio = user.bio || `Passionate developer exploring new tech. Working on @${username}_projects.`;

  return (
    <div className="absolute z-50 w-72 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 animate-in fade-in zoom-in-95 duration-200 pointer-events-none group-hover:pointer-events-auto">
      <div className="flex items-start justify-between mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="size-14 rounded-full border-2 border-primary/20 object-cover"
        />
        <button className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors">
          Follow +
        </button>
      </div>

      <div className="mb-3">
        <div
          className="flex items-center gap-1.5 cursor-pointer group/name w-fit"
          onClick={() => navigate(`/marketplace/growth/profile/${user.id}`)}
        >
          <h4 className="text-base font-black text-white leading-tight group-hover/name:text-blue-400 group-hover/name:underline transition-colors">
            {user.name}
          </h4>
          {user.role && <span className="material-symbols-outlined !text-[14px] text-green-500 fill-current">verified</span>}
        </div>
        <p
          className="text-xs text-[#8b949e] font-medium cursor-pointer hover:text-blue-400 w-fit hover:underline transition-colors"
          onClick={() => navigate(`/marketplace/growth/profile/${user.id}`)}
        >
          @{username}
        </p>
      </div>

      <p className="text-[12px] text-[#8b949e] leading-relaxed mb-4 line-clamp-3">
        {bio}
      </p>

      <div className="flex items-center gap-6 pt-4 border-t border-[#30363d]">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined !text-[16px] text-[#8b949e]">group</span>
          <span className="text-sm font-bold text-white">{followers.toLocaleString()}</span>
          <span className="text-xs text-[#8b949e]">followers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined !text-[16px] text-[#8b949e]">article</span>
          <span className="text-sm font-bold text-white">{postsCount}</span>
          <span className="text-xs text-[#8b949e]">posts</span>
        </div>
      </div>
    </div>
  );
};

export default UserHoverCard;
