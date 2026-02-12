import React from 'react';
import { Character, getCharacterColor } from '../../services/characters';
import './CharacterCard.css';

interface CharacterCardProps {
    character: Character;
    selected?: boolean;
    onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
    character,
    selected = false,
    onClick
}) => {
    return (
        <div
            className={`character-card ${selected ? 'character-card-selected' : ''}`}
            onClick={onClick}
            style={{
                borderColor: selected ? character.color : 'transparent',
                boxShadow: selected ? `0 0 20px ${character.color}60` : 'none'
            }}
        >
            <div className="character-card-image-container">
                <img
                    src={character.avatarUrl}
                    alt={character.name}
                    className="character-card-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/characters/default.png';
                    }}
                />
                {character.startingXP > 0 && (
                    <div className="character-bonus-badge">
                        +{character.startingXP} XP
                    </div>
                )}
            </div>

            <div className="character-card-content">
                <div className="character-card-header">
                    <h3 className="character-card-name" style={{ color: character.color }}>
                        {character.name}
                    </h3>
                    <span className="character-card-class">{character.classType}</span>
                </div>

                <p className="character-card-description">
                    {character.description}
                </p>

                <div className="character-card-theme">
                    <span className="character-theme-badge" style={{ backgroundColor: `${character.color}20`, color: character.color }}>
                        {character.theme}
                    </span>
                </div>
            </div>

            {selected && (
                <div className="character-selected-indicator" style={{ backgroundColor: character.color }}>
                    ✓ Selected
                </div>
            )}
        </div>
    );
};
