import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../../constants';
import { Job } from '../../types';
import JobCard from '../../components/jobs/JobCard';
import PostJobModal from '../../components/jobs/PostJobModal';

const MissionsView = () => {
  const navigate = useNavigate();
  const [localJobs, setLocalJobs] = useState<Job[]>(() => {
    let offeredJobs: Job[] = [];
    try {
        const saved = localStorage.getItem('trackcodex_offered_jobs');
        offeredJobs = saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to parse offered jobs from localStorage", e);
    }
    return [...MOCK_JOBS, ...offeredJobs];
  });
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);

  useEffect(() => {
    const draft = localStorage.getItem('pending_job_draft');
    if (draft) {
      setDraftData(JSON.parse(draft));
      setIsPostModalOpen(true);
      localStorage.removeItem('pending_job_draft');
    }
  }, []);

  const handlePostJob = (newJobData: Partial<Job>) => {
    const newJob: Job = { ...newJobData, id: `job-${Date.now()}` } as Job;
    setLocalJobs(prev => [newJob, ...prev]);
    setIsPostModalOpen(false);
  };

  return (
    <div className="p-8">
        <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-primary">search</span>
                    <input className="bg-gh-bg-secondary border border-gh-border rounded-full pl-12 pr-6 py-3 text-sm text-white focus:ring-1 focus:ring-primary w-96 outline-none" placeholder="Search missions by title, skill, or company..." />
                </div>
                <button 
                    onClick={() => setIsPostModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/30"
                >
                    Create New Mission
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {localJobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={() => navigate(`/marketplace/missions/${job.id}`)} />
                ))}
            </div>
        </div>
        <PostJobModal 
            isOpen={isPostModalOpen} 
            onClose={() => setIsPostModalOpen(false)} 
            onSubmit={handlePostJob}
            initialData={draftData}
        />
    </div>
  );
};

export default MissionsView;