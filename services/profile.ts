
import { SystemRole } from '../types';
import { systemBus } from './systemBus';

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  role: string;
  systemRole: SystemRole;
  bio: string;
  company: string;
  location: string;
  website: string;
  rating: number;
  jobsCompleted: number;
  ratingCount: number;
  followers: number;
  following: number;
  communityKarma: number;
  postsCount: number;
  skills: { name: string; level: number }[]; // Level 1-100
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Chen',
  username: 'alexcoder',
  avatar: 'https://picsum.photos/seed/alexprofile/600',
  role: 'Senior Engineer',
  systemRole: 'Super Admin',
  bio: 'Building secure distributed systems with Rust & Go. Exploring the edge of AI-assisted security auditing. 🛡️ 🤖',
  company: 'TrackCodex Security',
  location: 'Seattle, WA',
  website: 'alexchen.security',
  rating: 4.9,
  jobsCompleted: 24,
  ratingCount: 42,
  followers: 2402,
  following: 180,
  communityKarma: 320,
  postsCount: 12,
  skills: [
    { name: 'Rust', level: 92 },
    { name: 'Go', level: 85 },
    { name: 'TypeScript', level: 78 }
  ]
};

const STORAGE_KEY = 'trackcodex_user_profile';
const UPDATE_EVENT = 'trackcodex-profile-update';

export const profileService = {
  getProfile(): UserProfile {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  },

  updateProfile(updates: Partial<UserProfile>) {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
  },

  improveSkill(skillName: string, points: number) {
    const profile = this.getProfile();
    const updatedSkills = [...profile.skills];
    const skillIndex = updatedSkills.findIndex(s => s.name === skillName);
    
    if (skillIndex > -1) {
      updatedSkills[skillIndex].level = Math.min(100, updatedSkills[skillIndex].level + points);
    } else {
      updatedSkills.push({ name: skillName, level: points });
    }
    
    this.updateProfile({ skills: updatedSkills });
  },

  addKarma(points: number) {
    const profile = this.getProfile();
    this.updateProfile({ communityKarma: profile.communityKarma + points });
    
    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: {
        title: 'Reputation Gain',
        message: `You earned +${points} Karma points.`,
        type: 'success'
      }
    }));
  },

  addJobRating(newRating: number) {
    const profile = this.getProfile();
    const totalPoints = profile.rating * profile.ratingCount;
    const newCount = profile.ratingCount + 1;
    const updatedRating = Number(((totalPoints + newRating) / newCount).toFixed(1));
    
    this.updateProfile({
      rating: updatedRating,
      ratingCount: newCount,
      jobsCompleted: profile.jobsCompleted + 1
    });

    this.addKarma(25);
    systemBus.emit('JOB_COMPLETED', { rating: newRating });
  },

  subscribe(callback: (profile: UserProfile) => void) {
    const handler = (e: any) => callback(e.detail);
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }
};
