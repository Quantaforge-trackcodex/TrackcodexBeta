import React from 'react';
import { getCharacterColor } from '../../services/characters';
import './XPProgressBar.css';

interface XPProgressBarProps {
    currentXP: number;
    xpForNextLevel: number;
    characterKey: string | null;
    level: number;
    showStats?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
    currentXP,
    xpForNextLevel,
    characterKey,
    level,
    showStats = true
}) => {
    const progress = Math.min((currentXP / xpForNextLevel) * 100, 100);
    const color = characterKey ? getCharacterColor(characterKey) : '#6C757D';

    return (
        <div className="xp-progress-container">
            {showStats && (
                <div className="xp-progress-stats">
                    <span className="xp-current">{currentXP.toLocaleString()} XP</span>
                    <span className="xp-target">Level {level + 1}: {xpForNextLevel.toLocaleString()} XP</span>
                </div>
            )}

            <div className="xp-progress-bar-wrapper">
                <div
                    className="xp-progress-bar"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}80`
                    }}
                >
                    <div className="xp-progress-shimmer" />
                </div>

                <div className="xp-progress-percentage">
                    {progress.toFixed(1)}%
                </div>
            </div>
        </div>
    );
};
