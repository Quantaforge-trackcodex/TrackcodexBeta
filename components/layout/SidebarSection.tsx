
import React from 'react';

interface SidebarSectionProps {
  title: string;
  isExpanded: boolean;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, isExpanded, children }) => {
  return (
    <div>
      {isExpanded ? (
        <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 animate-in fade-in duration-200">
          {title}
        </p>
      ) : (
        <div className="h-px bg-white/5 my-4 mx-3"></div>
      )}
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  );
};

export default SidebarSection;
