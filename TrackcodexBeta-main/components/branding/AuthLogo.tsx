import React from "react";

const AuthLogo = ({ size = 64 }: { size?: number }) => (
  <svg
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="TrackCodex Logo"
    className="drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
  >
    {/* Chevron */}
    <path
      d="M256 80 L464 256 L384 336 L256 208 L128 336 L48 256 Z"
      fill="#ffffff"
    />
    {/* Diamond */}
    <path d="M256 368 L320 432 L256 496 L192 432 Z" fill="#3b82f6" />
  </svg>
);

export default AuthLogo;
