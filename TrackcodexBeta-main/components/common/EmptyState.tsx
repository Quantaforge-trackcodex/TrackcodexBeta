import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="h-[220px] overflow-hidden mb-6 flex items-start justify-center">
        <img
          src="/empty-state.png"
          alt="All caught up"
          className="max-w-[400px] w-full dark:opacity-60 dark:mix-blend-screen dark:[filter:invert(1)_hue-rotate(180deg)_brightness(0.85)_contrast(1.2)_grayscale(100%)] opacity-100 mix-blend-multiply"
        />
      </div>
      {title && (
        <h2 className="text-[20px] font-semibold text-gh-text mb-2">
          {title}
        </h2>
      )}
      {message && <p className="text-gh-text-secondary max-w-md">{message}</p>}
    </div>
  );
};

export default EmptyState;
