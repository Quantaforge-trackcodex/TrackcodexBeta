import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PublicProfile.css";
import styles from "./PinnedItemsGrid.module.css";

interface PinnedItem {
  type: "repository" | "portfolio";
  id: string;
  title: string;
  description?: string;
  language?: string;
  technologies?: string[];
  stars?: number;
  forks?: number;
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
}

interface PinnedItemsGridProps {
  items: PinnedItem[];
  userId: string;
  isOwner?: boolean;
}

const PinnedItemsGrid: React.FC<PinnedItemsGridProps> = ({
  items,
  userId,
  isOwner = false,
}) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <span className={`material-icons ${styles.emptyStateIcon}`}>
          push_pin
        </span>
        <p className={styles.emptyStateText}>
          {isOwner
            ? "No pinned items yet. Pin repositories or portfolio projects!"
            : "No pinned items to display"}
        </p>
      </div>
    );
  }

  const handleItemClick = (item: PinnedItem) => {
    if (item.type === "repository") {
      navigate(`/repo/${userId}/${item.title}`);
    } else if (item.demoUrl) {
      window.open(item.demoUrl, "_blank");
    }
  };

  const getLanguageColor = (language?: string) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      Go: "#00ADD8",
    };
    return colors[language || ""] || "#8b949e";
  };

  return (
    <div className="pinned-grid">
      {items.map((item) => (
        <div
          key={`${item.type}-${item.id}`}
          className="pinned-card"
          onClick={() => handleItemClick(item)}
        >
          <div className="pin-icon">
            <span className="material-icons">push_pin</span>
          </div>

          <div className="pinned-content">
            <div className="pinned-header">
              <span className="material-icons">
                {item.type === "repository" ? "folder" : "work_outline"}
              </span>
              <h4>{item.title}</h4>
            </div>

            {item.description && (
              <p className="pinned-description">{item.description}</p>
            )}

            {item.type === "repository" && (
              <div className="pinned-meta">
                {item.language && (
                  <div className="language-info">
                    <span
                      className={styles.languageDot}
                      style={
                        {
                          "--lang-color": getLanguageColor(item.language),
                        } as React.CSSProperties
                      }
                    />
                    <span>{item.language}</span>
                  </div>
                )}
                <div className="pinned-stats">
                  {item.stars !== undefined && (
                    <span>
                      <span className="material-icons">star_outline</span>
                      {item.stars}
                    </span>
                  )}
                  {item.forks !== undefined && (
                    <span>
                      <span className="material-icons">fork_right</span>
                      {item.forks}
                    </span>
                  )}
                </div>
              </div>
            )}

            {item.type === "portfolio" && item.technologies && (
              <div className="pinned-tech">
                {item.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 3 && (
                  <span className="tech-badge">
                    +{item.technologies.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="pinned-links">
              {item.type === "portfolio" && (
                <>
                  {item.demoUrl && (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="link-btn"
                    >
                      <span className="material-icons">open_in_new</span>
                    </a>
                  )}
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="link-btn"
                    >
                      <span className="material-icons">code</span>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PinnedItemsGrid;
