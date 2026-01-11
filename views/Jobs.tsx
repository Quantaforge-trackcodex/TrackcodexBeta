
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';
import JobCard from '../components/jobs/JobCard';
import PostJobModal from '../components/jobs/PostJobModal';

const JobsView = () => {
  const navigate = useNavigate();
  const [localJobs, setLocalJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('trackcodex_offered_jobs');
    const offeredJobs = saved ? JSON.parse(saved) : [];
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
    const newJob: Job = {
      ...newJobData,
      id: `job-${Date.now()}`,
    } as Job;
    
    setLocalJobs(prev => [newJob, ...prev]);
    setIsPostModalOpen(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0d1117] font-display">
      <aside className="w-[280px] border-r border-[#1e293b] flex flex-col shrink-0 p-6">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">filter_alt</span>
          Mission Marketplace
        </h2>
        
        <div className="space-y-6">
           <section>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Your Status</p>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                 <div className="flex items-center gap-2 text-primary text-xs font-bold mb-1">
                   <span className="material-symbols-outlined !text-[16px]">psychology</span>
                   Expert Tier
                 </div>
                 <p className="text-[10px] text-slate-400 leading-relaxed">Your 340+ Karma unlocks premium mission contracts.</p>
              </div>
           </section>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-8 border-b border-[#1e293b]">
           <div className="flex items-start justify-between">
              <div>
                 <h1 className="text-3xl font-black text-white tracking-tight mb-2">FORGE MISSIONS</h1>
                 <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                   High-value contracts derived directly from active enterprise workspaces. Verified source, verified pay.
                 </p>
              </div>
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/30"
              >
                 Create New Mission
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {localJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
              ))}
           </div>
        </div>
      </main>

      <PostJobModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onSubmit={handlePostJob}
        initialData={draftData}
      />
    </div>
  );
};

export default JobsView;
