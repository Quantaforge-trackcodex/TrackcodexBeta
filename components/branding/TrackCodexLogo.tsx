import React from "react";
import { useNavigate } from "react-router-dom";

interface TrackCodexLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "splash";
  collapsed?: boolean;
  clickable?: boolean;
  className?: string;
}

const TrackCodexLogo: React.FC<TrackCodexLogoProps> = ({
  size = "md",
  collapsed = false,
  clickable = true,
  className = "",
}) => {
  const navigate = useNavigate();

  const sizeMap = {
    sm: "size-6",
    md: "size-8",
    lg: "size-12",
    xl: "size-16",
    splash: "size-32",
  };

  const containerClasses = `flex items-center gap-3 ${clickable ? "cursor-pointer" : "pointer-events-none"} ${className}`;

  const logoElement = (
    <div
      className={`${sizeMap[size]} shrink-0 transition-transform active:scale-95 duration-200`}
      onClick={() => clickable && navigate("/dashboard/home")}
    >
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        aria-label="TrackCodex Logo"
      >
        {/* Chevron - Floating Above */}
        <path
          d="M256 80 L464 256 L384 336 L256 208 L128 336 L48 256 Z"
          fill="currentColor"
          className="text-white"
        />
        {/* Diamond - The Foundation */}
        <path
          d="M256 368 L320 432 L256 496 L192 432 Z"
          fill="#3b82f6"
          className="animate-pulse"
        />
      </svg>
    </div>
  );

  if (collapsed) return logoElement;

  return (
    <div className={containerClasses}>
      {logoElement}
      <div className="flex flex-col select-none">
        <span
          className={`font-black tracking-tighter text-white leading-none ${size === "lg" ? "text-2xl" : size === "xl" ? "text-3xl" : "text-lg"}`}
        >
          TrackCodex
        </span>
        {size !== "sm" && (
          <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-0.5">
            Enterprise IDE
          </span>
        )}
      </div>
    </div>
  );
};

export default TrackCodexLogo;
