import React from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_TRIAL_REPOS } from "../../constants";
import { TrialRepo } from "../../types";

const TrialCard: React.FC<{ trial: TrialRepo }> = ({ trial }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/marketplace/trials/${trial.id}`);
  };

  const handleStartTrial = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Here we could go directly to workspace OR the detail view first
    // User asked to "apply for the same", so detail view seems appropriate as "Apply" step
    navigate(`/marketplace/trials/${trial.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6 flex flex-col relative group hover:border-primary transition-all duration-300 cursor-pointer"
    >
      {/* Header: Logo & Salary */}
      <div className="flex justify-between items-start mb-5">
        <div className="size-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm overflow-hidden">
          <img
            src={trial.logo}
            className="w-full h-full object-contain"
            alt={trial.company}
          />
        </div>
        <div className="px-3 py-1.5 bg-primary/15 text-primary text-[11px] font-bold rounded-full border border-primary/20 tracking-wide">
          {trial.salaryRange}
        </div>
      </div>

      {/* Title & Location */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gh-text mb-1.5 tracking-tight group-hover:text-primary transition-colors">
          {trial.title}
        </h3>
        <div className="text-[13px] text-gh-text-secondary font-medium flex items-center gap-1.5">
          <span className="text-gh-text/90">{trial.company}</span>
          <span className="text-gh-text-secondary">•</span>
          <span>{trial.location}</span>
        </div>
      </div>

      {/* Repo & Mission */}
      <div className="mb-6 flex-1">
        <div className="flex items-center gap-2 text-primary text-[13px] font-mono mb-3 opacity-90 hover:underline">
          <span className="material-symbols-outlined !text-[16px] -mt-0.5">
            code
          </span>
          {trial.repoName || "repo/unknown"}
        </div>
        <div className="p-4 bg-gh-bg border border-gh-border rounded-lg relative">
          <p className="text-[13px] text-gh-text leading-relaxed italic font-medium">
            "{trial.description}"
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {trial.tech.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 bg-gh-bg border border-gh-border text-gh-text-secondary text-[11px] font-semibold rounded-md"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Action */}
      <button
        onClick={handleStartTrial}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
      >
        <span className="material-symbols-outlined !text-[18px] filled">
          play_arrow
        </span>
        Start Trial
      </button>
    </div>
  );
};

const TrialRepositoriesView = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gh-text mb-2">
          Repo-Based Job Feed
        </h2>
        <p className="text-gh-text-secondary text-[15px]">
          {" "}
          Prove your skills by solving real issues on enterprise repositories.
          Start a trial and get hired.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TRIAL_REPOS.map((trial) => (
          <TrialCard key={trial.id} trial={trial} />
        ))}
      </div>
    </div>
  );
};

export default TrialRepositoriesView;
