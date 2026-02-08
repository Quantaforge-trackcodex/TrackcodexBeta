
import React from 'react';

// Props interface for StatusBarItem to explicitly handle optional children and other attributes
interface StatusBarItemProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// Typed as React.FC to ensure better compatibility with TypeScript JSX type checking
const StatusBarItem: React.FC<StatusBarItemProps> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`h-full flex items-center px-3 gap-1.5 hover:bg-white/10 cursor-pointer transition-colors text-white/80 hover:text-white whitespace-nowrap ${className}`}
  >
    {children}
  </div>
);

const StatusBar = () => {
  return (
    <footer className="h-[22px] bg-[#135bec] flex items-center justify-between text-[10px] font-bold uppercase tracking-widest shrink-0 z-50 select-none">
      <div className="flex items-center h-full">
        <StatusBarItem className="bg-black/10">
          <span className="material-symbols-outlined !text-[14px]">terminal</span>
          <span>Core-API Environment</span>
        </StatusBarItem>
        <StatusBarItem>
          <span className="material-symbols-outlined !text-[14px]">account_tree</span>
          <span>main</span>
        </StatusBarItem>
      </div>

      <div className="flex items-center h-full">
        <StatusBarItem>
           <span className="material-symbols-outlined !text-[14px] filled">auto_awesome</span>
           <span>ForgeAI Active</span>
        </StatusBarItem>
        <StatusBarItem className="bg-emerald-600 px-4">
           <span>Live Session: Sarah C</span>
        </StatusBarItem>
      </div>
    </footer>
  );
};

export default StatusBar;
