import React, { useEffect, useState } from "react";
import "../../styles/PublicProfile.css";
import styles from "./ContributionGraph.module.css";

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

interface ContributionGraphProps {
  userId: string;
  year?: number;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  userId,
  year = new Date().getFullYear(),
}) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (userId) {
      loadContributions();
    }
  }, [userId, year]);

  const loadContributions = async () => {
    setLoading(true);
    try {
      const [contribRes, streakRes, totalRes] = await Promise.all([
        fetch(`/api/v1/stats/contributions/${userId}?year=${year}`),
        fetch(`/api/v1/stats/streak/${userId}`),
        fetch(`/api/v1/stats/total/${userId}?year=${year}`),
      ]);

      if (contribRes.ok) {
        const data = await contribRes.json();
        setContributions(data.contributions || []);
      }

      if (streakRes.ok) {
        const data = await streakRes.json();
        setStreak(data.streak);
      }

      if (totalRes.ok) {
        const data = await totalRes.json();
        setTotalContributions(data.total || 0);
      }
    } catch (error) {
      console.error("Error loading contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: number) => {
    const colors = {
      0: "#161b22",
      1: "#0e4429",
      2: "#006d32",
      3: "#26a641",
      4: "#39d353",
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const getMonthLabel = (weekIndex: number) => {
    if (contributions.length === 0) return "";
    const date = new Date(contributions[weekIndex * 7]?.date);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const prevDate =
      weekIndex > 0 ? new Date(contributions[(weekIndex - 1) * 7]?.date) : null;
    const prevMonth = prevDate?.toLocaleDateString("en-US", { month: "short" });

    return month !== prevMonth ? month : "";
  };

  if (loading) {
    return (
      <div className="contribution-graph-loading">
        <p>Loading contribution graph...</p>
      </div>
    );
  }

  // Group contributions by weeks
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <div className="contribution-graph">
      <div className="contribution-stats">
        <div className="stat">
          <strong>{totalContributions}</strong> contributions in {year}
        </div>
        <div className="stat">
          <strong>{streak.current}</strong> day current streak
        </div>
        <div className="stat">
          <strong>{streak.longest}</strong> day longest streak
        </div>
      </div>

      <div className="contribution-grid-container">
        <div className="contribution-grid">
          <div className="month-labels">
            {weeks.map((_, weekIndex) => (
              <div key={weekIndex} className="month-label">
                {getMonthLabel(weekIndex)}
              </div>
            ))}
          </div>

          <div className="day-labels">
            <div>Mon</div>
            <div>Wed</div>
            <div>Fri</div>
          </div>

          <div className="weeks-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`day-cell ${styles.dayCell}`}
                    style={
                      {
                        "--level-color": getLevelColor(day.level),
                      } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredDay({
                        date: day.date,
                        count: day.count,
                        x: rect.left,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {hoveredDay && (
          <div
            className="contribution-tooltip"
            style={{
              left: hoveredDay.x + "px",
              top: hoveredDay.y - 50 + "px",
            }}
          >
            <div>{hoveredDay.count} contributions</div>
            <div>
              {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </div>

      <div className="contribution-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`legend-cell ${styles.legendCell}`}
            style={
              { "--level-color": getLevelColor(level) } as React.CSSProperties
            }
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionGraph;
