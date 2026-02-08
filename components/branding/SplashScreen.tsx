import React from "react";
import TrackCodexLogo from "./TrackCodexLogo";

const SplashScreen = () => {
  console.log("SplashScreen: Rendering...");
  return (
    <div className="fixed inset-0 z-[1000] bg-[#09090b] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse group-hover:blur-[100px] transition-all"></div>
        <TrackCodexLogo size="splash" clickable={false} className="scale-110" />
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-primary animate-bounce shadow-[0_0_8px_rgba(19,91,236,1)]"></div>
          <div className="size-1.5 rounded-full bg-primary animate-bounce delay-150 shadow-[0_0_8px_rgba(19,91,236,1)]"></div>
          <div className="size-1.5 rounded-full bg-primary animate-bounce delay-300 shadow-[0_0_8px_rgba(19,91,236,1)]"></div>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] animate-pulse">
          Initializing Engineering OS
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
