import React from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_ORGANIZATIONS } from "../../constants";
import { Organization } from "../../types";
import EmptyState from "../../components/common/EmptyState";

// FIX: Changed component to React.FC to correctly handle the 'key' prop when used in a list.
const OrganizationCard: React.FC<{ org: Organization }> = ({ org }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/org/${org.id}`)}
      className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer flex items-center gap-6"
    >
      <img
        src={org.avatar}
        alt={org.name}
        className="size-16 rounded-lg border-2 border-gh-border p-1 object-cover"
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gh-text group-hover:text-primary transition-colors">
          {org.name}
        </h3>
        <p className="text-sm text-gh-text-secondary mt-1 line-clamp-1">
          {org.description}
        </p>
      </div>
      <button className="px-4 py-2 bg-gh-bg-tertiary text-gh-text-secondary text-xs font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
        Dashboard
      </button>
    </div>
  );
};

const OrganizationIndexView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gh-bg p-8 font-display">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gh-text tracking-tight mb-2">
              Your Organizations
            </h1>
            <p className="text-gh-text-secondary">
              Select an organization to manage its repositories, teams, and
              members.
            </p>
          </div>
          <button
            onClick={() => {
              /* Logic to create new org */
            }}
            className="bg-primary hover:bg-blue-600 text-primary-foreground hover:text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New organization
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_ORGANIZATIONS.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-gh-border rounded-2xl">
              <EmptyState />
            </div>
          ) : (
            MOCK_ORGANIZATIONS.map((org) => (
              <OrganizationCard key={org.id} org={org} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationIndexView;
