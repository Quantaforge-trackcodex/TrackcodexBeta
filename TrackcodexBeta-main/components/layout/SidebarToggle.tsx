
import React from 'react';

interface SidebarToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isExpanded, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="size-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
      title={isExpanded ? "Collapse Sidebar (Ctrl+B)" : "Expand Sidebar (Ctrl+B)"}
      aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
    >
      <span className="material-symbols-outlined !text-[20px]">
        {isExpanded ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'}
      </span>
    </button>
  );
};

export default SidebarToggle;
