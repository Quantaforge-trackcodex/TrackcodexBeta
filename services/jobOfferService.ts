
import { Job } from '../types';
import { profileService } from './profile';

const JOB_STORAGE_KEY = 'trackcodex_offered_jobs';

export const jobOfferService = {
  createOffer(jobData: Partial<Job>) {
    const jobs = this.getOfferedJobs();
    const currentUser = profileService.getProfile();
    
    const newJob: Job = {
      id: `job-offer-${Date.now()}`,
      title: jobData.title || 'Untitled Offer',
      description: jobData.description || '',
      techStack: jobData.techStack || [],
      budget: jobData.budget || '$0',
      type: jobData.type || 'Contract',
      status: 'Pending',
      repoId: jobData.repoId || 'trackcodex-backend',
      creator: {
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      postedDate: 'Just now',
      targetUserId: jobData.targetUserId,
      personalNote: jobData.personalNote
    };

    const updatedJobs = [newJob, ...jobs];
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));
    
    this.sendOfferEmail(newJob);
    return newJob;
  },

  getOfferedJobs(): Job[] {
    const saved = localStorage.getItem(JOB_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  sendOfferEmail(job: Job) {
    // Simulated Email Log
    console.log(`
      [TrackCodex Email System]
      To: ${job.targetUserId}@trackcodex.dev
      Subject: New Job Offer from ${job.creator.name}
      
      Hi! ${job.creator.name} has offered you a new position: "${job.title}".
      
      Budget: ${job.budget}
      Type: ${job.type}
      
      "${job.personalNote || 'No personal note provided.'}"
      
      View full details at: https://trackcodex.io/jobs/offer/${job.id}
    `);
    
    // Dispatch event for UI notification
    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: {
        title: 'Job Offer Sent',
        message: `Professional offer email sent to @${job.targetUserId}`,
        type: 'success'
      }
    }));
  }
};
