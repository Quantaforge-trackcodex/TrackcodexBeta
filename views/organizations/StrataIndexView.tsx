import React from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_STRATA } from "../../constants";
import { Strata } from "../../types";
import EmptyState from "../../components/common/EmptyState";

// FIX: Changed component to React.FC to correctly handle the 'key' prop when used in a list.
const StrataCard: React.FC<{ strata: Strata }> = ({ strata }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/strata/${strata.id}`)}
      className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer flex items-center gap-6"
    >
      <img
        src={strata.avatar}
        alt={strata.name}
        className="size-16 rounded-lg border-2 border-gh-border p-1 object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gh-text group-hover:text-primary transition-colors">
          {strata.name}
        </h3>
        <p className="text-sm text-gh-text-secondary mt-1 line-clamp-1">
          {strata.description}
        </p>
      </div>
      <button className="px-4 py-2 bg-gh-bg-tertiary text-gh-text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
        Dashboard
      </button>
    </div>
  );
};

const StrataIndexView = () => {

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gh-bg p-8 font-display">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
              Your Strata
            </h1>
            <p className="text-gh-text-secondary">
              Select a Strata to manage its repositories, teams, and
              members.
            </p>
          </div>
          <button
            onClick={() => {
              /* Logic to create new org */
            }}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Strata
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_STRATA.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-gh-border rounded-2xl">
              <EmptyState />
            </div>
          ) : (
            MOCK_STRATA.map((strata) => (
              <StrataCard key={strata.id} strata={strata} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StrataIndexView;
