import React, { useState, useEffect } from 'react';
import { gamificationApi, GamificationProfile, LeaderboardEntry } from '../services/gamification';
import { CharacterAvatar } from '../components/gamification/CharacterAvatar';
import { LevelBadge } from '../components/gamification/LevelBadge';
import { XPProgressBar } from '../components/gamification/XPProgressBar';
import './LevelView.css';

export const LevelView: React.FC = () => {
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [profileData, leaderboardData] = await Promise.all([
                gamificationApi.getProfile(),
                gamificationApi.getLeaderboard(10)
            ]);
            setProfile(profileData);
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error('Error loading gamification data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="level-view-container">
                <div className="level-view-loading">Loading your level data...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="level-view-container">
                <div className="level-view-error">Failed to load profile data</div>
            </div>
        );
    }

    return (
        <div className="level-view-container">
            {/* Hero Section */}
            <div className="level-hero-section">
                <div className="level-hero-character">
                    <CharacterAvatar
                        characterKey={profile.user.characterId}
                        size="xlarge"
                        showLevel={true}
                        level={profile.level}
                        showBadge={true}
                    />
                </div>

                <div className="level-hero-info">
                    <h1 className="level-hero-username">{profile.user.username || profile.user.name}</h1>
                    {profile.user.characterName && (
                        <h2 className="level-hero-character-name">{profile.user.characterName}</h2>
                    )}

                    <div className="level-hero-badge">
                        <LevelBadge
                            level={profile.level}
                            rank={profile.rank}
                            characterKey={profile.user.characterId}
                            size="large"
                        />
                    </div>
                </div>
            </div>

            {/* XP Progress Section */}
            <div className="level-progress-section">
                <h3 className="section-title">Experience Progress</h3>
                <XPProgressBar
                    currentXP={profile.xpIntoCurrentLevel}
                    xpForNextLevel={profile.xpNeededForNextLevel}
                    characterKey={profile.user.characterId}
                    level={profile.level}
                    showStats={true}
                />

                <div className="level-stats-grid">
                    <div className="level-stat-card">
                        <div className="level-stat-value">{profile.xp.toLocaleString()}</div>
                        <div className="level-stat-label">Total XP</div>
                    </div>
                    <div className="level-stat-card">
                        <div className="level-stat-value">{profile.level}</div>
                        <div className="level-stat-label">Current Level</div>
                    </div>
                    <div className="level-stat-card">
                        <div className="level-stat-value">{profile.rank}</div>
                        <div className="level-stat-label">Rank</div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Section */}
            <div className="level-leaderboard-section">
                <h3 className="section-title">Top Players</h3>
                <div className="leaderboard-list">
                    {leaderboard.map((entry) => (
                        <div key={entry.id} className="leaderboard-entry">
                            <div className="leaderboard-position">#{entry.position}</div>
                            <CharacterAvatar
                                characterKey={entry.characterId}
                                size="small"
                                showLevel={true}
                                level={entry.level}
                            />
                            <div className="leaderboard-info">
                                <div className="leaderboard-username">{entry.username || entry.name}</div>
                                <div className="leaderboard-rank">{entry.rank}</div>
                            </div>
                            <div className="leaderboard-stats">
                                <div className="leaderboard-level">Lv. {entry.level}</div>
                                <div className="leaderboard-xp">{entry.experiencePoints.toLocaleString()} XP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LevelView;

