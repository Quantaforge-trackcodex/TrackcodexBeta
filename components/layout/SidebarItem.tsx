
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  to: string;
  icon: string;
  label: string;
  isExpanded: boolean;
  badgeCount?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isExpanded, badgeCount }) => {
  return (
    <NavLink
      to={to}
      title={!isExpanded ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative ${
          isActive
            ? 'bg-[#1e293b] text-white font-medium'
            : 'text-slate-400 hover:bg-[#1e293b]/50 hover:text-slate-100'
        } ${!isExpanded ? 'justify-center px-0 mx-2' : ''}`
      }
    >
      <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
      
      {isExpanded && (
        <>
          <span className="text-[13px] font-medium flex-1 truncate animate-in fade-in duration-200">{label}</span>
          {badgeCount && (
            <span className="bg-[#2d333b] text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {badgeCount}
            </span>
          )}
        </>
      )}

      {!isExpanded && badgeCount && (
        <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full border-2 border-[#0d1117]"></span>
      )}
    </NavLink>
  );
};

export default SidebarItem;
