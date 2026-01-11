
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TrackCodexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  collapsed?: boolean;
  clickable?: boolean;
  className?: string;
}

const TrackCodexLogo: React.FC<TrackCodexLogoProps> = ({ 
  size = 'md', 
  collapsed = false, 
  clickable = true,
  className = ""
}) => {
  const navigate = useNavigate();

  const sizeMap = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-12',
    xl: 'size-16',
    splash: 'size-32'
  };

  const containerClasses = `flex items-center gap-3 ${clickable ? 'cursor-pointer' : 'pointer-events-none'} ${className}`;
  
  const logoElement = (
    <div 
      className={`${sizeMap[size]} shrink-0 transition-transform active:scale-95 duration-200`}
      onClick={() => clickable && navigate('/dashboard/home')}
    >
      <svg 
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(19,91,236,0.5)]"
        aria-label="TrackCodex Logo"
      >
        {/* Modern high-fidelity reconstruction of the blue diamond interlocking logo */}
        <path 
          d="M256 64L448 256L320 384L128 192L256 64Z" 
          fill="#135bec" 
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <path 
          d="M256 448L64 256L192 128L384 320L256 448Z" 
          fill="#0a46c2" 
        />
        <path 
          d="M256 160L352 256L256 352L160 256L256 160Z" 
          fill="#09090b" 
        />
      </svg>
    </div>
  );

  if (collapsed) return logoElement;

  return (
    <div className={containerClasses}>
      {logoElement}
      <div className="flex flex-col select-none">
        <span className={`font-black tracking-tighter text-white leading-none ${size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-lg'}`}>
          TrackCodex
        </span>
        {size !== 'sm' && (
          <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-0.5">
            Enterprise IDE
          </span>
        )}
      </div>
    </div>
  );
};

export default TrackCodexLogo;
