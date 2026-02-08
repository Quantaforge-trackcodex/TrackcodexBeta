import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  to: string;
  icon: string;
  label: string;
  isExpanded: boolean;
  roleRestricted?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  isExpanded,
  roleRestricted,
}) => {
  if (roleRestricted) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group/item
        ${isActive
          ? "bg-primary/15 text-primary font-bold shadow-[0_0_20px] shadow-primary/30 border border-primary/20"
          : "text-gh-text-secondary hover:bg-gh-bg hover:text-gh-text hover:translate-x-1 hover:shadow-lg hover:shadow-primary/10 hover:border-l-2 hover:border-primary/50"
        }
        ${!isExpanded ? "justify-center mx-2" : "mx-2"}
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator Line */}
          {isActive && (
            <div className="absolute left-[-8px] top-2 bottom-2 w-1 bg-primary rounded-r-full shadow-[0_0_15px] shadow-primary/50" />
          )}

          {/* Icon */}
          <span
            className={`material-symbols-outlined !text-[20px] shrink-0 transition-colors ${isActive ? "text-primary drop-shadow-[0_0_8px] drop-shadow-primary/50" : "text-gh-text-secondary group-hover/item:text-slate-300"}`}
          >
            {icon}
          </span>

          {/* Label (Visible when expanded) */}
          {isExpanded ? (
            <span className="text-[13px] whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
              {label}
            </span>
          ) : (
            /* Tooltip (Visible when collapsed) */
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#16161a] border border-white/10 rounded-md text-[11px] font-bold text-white whitespace-nowrap opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover/item:translate-x-0 z-[100] shadow-2xl">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
