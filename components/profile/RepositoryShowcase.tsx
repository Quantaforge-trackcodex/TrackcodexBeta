import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PublicProfile.css";
import styles from "./RepositoryShowcase.module.css";

interface Repository {
  id: string;
  name: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  updatedAt: string;
  visibility: string;
}

interface RepositoryShowcaseProps {
  repositories: Repository[];
  userId: string;
  isOwner?: boolean;
}

const RepositoryShowcase: React.FC<RepositoryShowcaseProps> = ({
  repositories,
  userId,
  isOwner = false,
}) => {
  const navigate = useNavigate();

  if (!repositories || repositories.length === 0) {
    return (
      <div className="empty-state">
        <span className={`material-icons ${styles.emptyStateIcon}`}>
          folder_open
        </span>
        <p className={styles.emptyStateText}>
          {isOwner
            ? "No repositories yet. Create your first project!"
            : "No repositories to display"}
        </p>
      </div>
    );
  }

  const getLanguageColor = (language?: string) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      Go: "#00ADD8",
      Rust: "#dea584",
      C: "#555555",
      "C++": "#f34b7d",
      Ruby: "#701516",
      PHP: "#4F5D95",
    };
    return colors[language || ""] || "#8b949e";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Updated ${months} month${months > 1 ? "s" : ""} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `Updated ${years} year${years > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="repo-showcase">
      {repositories.map((repo) => (
        <div
          key={repo.id}
          className={`repo-card ${styles.repoCard}`}
          onClick={() => navigate(`/repo/${userId}/${repo.name}`)}
        >
          <div className="repo-header">
            <div className="repo-name">
              <span className="material-icons">folder</span>
              <h4>{repo.name}</h4>
            </div>
            <span className="repo-visibility">{repo.visibility}</span>
          </div>

          {repo.description && (
            <p className="repo-description">{repo.description}</p>
          )}

          <div className="repo-meta">
            {repo.language && (
              <div className="repo-language">
                <span
                  className={styles.languageDot}
                  style={
                    {
                      "--lang-color": getLanguageColor(repo.language),
                    } as React.CSSProperties
                  }
                />
                <span>{repo.language}</span>
              </div>
            )}

            <div className="repo-stats">
              <span className="stat">
                <span className="material-icons">star_outline</span>
                <span>{repo.stars}</span>
              </span>
              <span className="stat">
                <span className="material-icons">fork_right</span>
                <span>{repo.forks}</span>
              </span>
            </div>

            <span className="repo-updated">{formatDate(repo.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepositoryShowcase;
