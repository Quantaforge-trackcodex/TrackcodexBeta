import React from "react";
import { MOCK_REPOS } from "../../constants";
import styles from "./VisualPortfolio.module.css";

const VisualPortfolio = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between px-1 mb-6">
        <h3 className="text-lg font-semibold text-gh-text tracking-tight">
          Visual Portfolio
        </h3>
        <div className="flex gap-2 text-xs font-bold text-gh-text-secondary">
          <span className="text-gh-text">Posts</span>
          <span>•</span>
          <span>Saved</span>
          <span>•</span>
          <span>Tagged</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MOCK_REPOS.slice(0, 9).map((repo, i) => (
          <div
            key={repo.id}
            className="aspect-square bg-gh-bg-secondary border border-gh-border rounded-lg overflow-hidden group cursor-pointer relative"
          >
            {/* Mock Image Gradient based on tech color */}
            <div
              className={`w-full h-full opacity-20 group-hover:opacity-30 transition-opacity ${styles.portfolioGradient}`}
              style={
                {
                  "--gradient-bg": `linear-gradient(45deg, ${repo.techColor}, var(--gh-bg))`,
                } as React.CSSProperties
              }
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <span className="material-symbols-outlined text-4xl text-white mb-2 shadow-black drop-shadow-lg">
                {i % 2 === 0 ? "terminal" : "dataset"}
              </span>
              <h4 className="font-bold text-white text-sm drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                {repo.name}
              </h4>
            </div>

            {/* Stats Overlay on Hover */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="material-symbols-outlined filled !text-[18px]">
                  favorite
                </span>
                {((repo.name.length * 97) % 400) + 50}
              </div>
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="material-symbols-outlined filled !text-[18px]">
                  chat_bubble
                </span>
                {((repo.name.length * 13) % 40) + 5}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualPortfolio;
