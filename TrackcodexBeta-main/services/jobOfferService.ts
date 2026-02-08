import { Job } from "../types";
import { profileService } from "./profile";

const JOB_STORAGE_KEY = "trackcodex_offered_jobs";

export const jobOfferService = {
  createOffer(jobData: Partial<Job>) {
    const jobs = this.getOfferedJobs();
    const currentUser = profileService.getProfile();

    const newJob: Job = {
      id: `job-offer-${Date.now()}`,
      title: jobData.title || "Untitled Offer",
      description: jobData.description || "",
      techStack: jobData.techStack || [],
      budget: jobData.budget || "$0",
      type: jobData.type || "Contract",
      status: "Pending",
      repoId: jobData.repoId || "trackcodex-backend",
      creator: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      postedDate: "Just now",
      targetUserId: jobData.targetUserId,
      personalNote: jobData.personalNote,
      offerDetails: jobData.offerDetails, // Persist rich offer details
    };

    const updatedJobs = [newJob, ...jobs];
    localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(updatedJobs));

    // Trigger global notification with functional buttons
    window.dispatchEvent(
      new CustomEvent("trackcodex-notification", {
        detail: {
          title: "New Mission Offer",
          message: `${currentUser.name} sent you a private mission offer: "${newJob.title}"`,
          type: "mission",
          jobId: newJob.id,
          hasActions: true,
        },
      }),
    );

    return newJob;
  },

  getOfferedJobs(): Job[] {
    const saved = localStorage.getItem(JOB_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },
};
