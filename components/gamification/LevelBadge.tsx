import React from 'react';
import { getCharacterColor } from '../../services/characters';
import './LevelBadge.css';

interface LevelBadgeProps {
    level: number;
    rank: string;
    characterKey: string | null;
    size?: 'small' | 'medium' | 'large';
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
    level,
    rank,
    characterKey,
    size = 'medium'
}) => {
    const color = characterKey ? getCharacterColor(characterKey) : '#6C757D';

    return (
        <div className={`level-badge level-badge-${size}`}>
            <div
                className="level-badge-level"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 15px ${color}60`
                }}
            >
                <span className="level-badge-number">{level}</span>
            </div>
            <div className="level-badge-rank" style={{ color }}>
                {rank}
            </div>
        </div>
    );
};
