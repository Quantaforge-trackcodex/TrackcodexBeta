import React from 'react';
import { getCharacterColor } from '../../services/characters';
import './CharacterAvatar.css';

interface CharacterAvatarProps {
    characterKey: string | null;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    showLevel?: boolean;
    level?: number;
    showBadge?: boolean;
    className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
    characterKey,
    size = 'medium',
    showLevel = false,
    level,
    showBadge = false,
    className = ''
}) => {
    const sizeMap = {
        small: '32px',
        medium: '48px',
        large: '64px',
        xlarge: '120px'
    };

    const avatarSize = sizeMap[size];
    const color = characterKey ? getCharacterColor(characterKey) : '#6C757D';
    const avatarUrl = characterKey ? `/assets/characters/${characterKey}.png` : '/assets/characters/default.png';

    return (
        <div className={`character-avatar character-avatar-${size} ${className}`}>
            <div
                className="character-avatar-border"
                style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderColor: color,
                    boxShadow: `0 0 15px ${color}40`
                }}
            >
                <img
                    src={avatarUrl}
                    alt={characterKey || 'Character'}
                    className="character-avatar-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/characters/default.png';
                    }}
                />

                {showLevel && level !== undefined && (
                    <div
                        className="character-level-badge"
                        style={{ backgroundColor: color }}
                    >
                        {level}
                    </div>
                )}

                {showBadge && (
                    <div className="character-glow" style={{ backgroundColor: color }} />
                )}
            </div>
        </div>
    );
};
