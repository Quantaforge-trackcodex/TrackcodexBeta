import React from "react";
import { useParams } from "react-router-dom";

const DeveloperProfileView = () => {
  const { id } = useParams();

  return (
    <div className="p-8 text-gh-text max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-8">
        <div className="size-24 rounded-full bg-gh-bg-secondary border-2 border-primary border-dashed flex items-center justify-center text-4xl font-bold">
          {id?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer Profile</h1>
          <p className="text-xl text-gh-text-secondary">Viewing profile for user ID: <span className="text-primary font-mono">{id}</span></p>
        </div>
      </div>

      <div className="bg-gh-bg-secondary border border-gh-border rounded-xl p-8 text-center text-gh-text-secondary">
        <span className="material-symbols-outlined !text-6xl mb-4 opacity-50">construction</span>
        <h2 className="text-xl font-bold mb-2">Profile Under Construction</h2>
        <p>This user's full profile page is coming soon.</p>
      </div>
    </div>
  );
};

export default DeveloperProfileView;
