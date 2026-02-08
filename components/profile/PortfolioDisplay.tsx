import React from "react";
import "../../styles/PublicProfile.css";
import styles from "./PortfolioDisplay.module.css";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
  technologies: string[];
  featured: boolean;
  order: number;
}

interface PortfolioDisplayProps {
  items: PortfolioItem[];
  isOwner?: boolean;
}

const PortfolioDisplay: React.FC<PortfolioDisplayProps> = ({
  items,
  isOwner = false,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <span className={`material-icons ${styles.emptyStateIcon}`}>
          work_outline
        </span>
        <p className={styles.emptyStateText}>
          {isOwner
            ? "No portfolio items yet. Add some in Settings!"
            : "No portfolio items to display"}
        </p>
      </div>
    );
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });

  return (
    <div className="portfolio-grid">
      {sortedItems.map((item) => (
        <div key={item.id} className="portfolio-card">
          {item.featured && (
            <div className="featured-badge">
              <span className="material-icons">star</span>
              <span>Pinned</span>
            </div>
          )}

          {item.imageUrl && (
            <div className="portfolio-image">
              <img src={item.imageUrl} alt={item.title} />
            </div>
          )}

          <div className="portfolio-content">
            <h3>{item.title}</h3>
            <p className="portfolio-description">{item.description}</p>

            {item.technologies && item.technologies.length > 0 && (
              <div className="portfolio-tech">
                {item.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="portfolio-links">
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  <span className="material-icons">open_in_new</span>
                  <span>Live Demo</span>
                </a>
              )}
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-link"
                >
                  <span className="material-icons">code</span>
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioDisplay;
