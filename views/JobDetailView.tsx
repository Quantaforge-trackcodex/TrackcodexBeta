
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../constants';
import { Job } from '../types';
import JobRatingModal from '../components/jobs/JobRatingModal';
import { profileService } from '../services/profile';
import { directMessageBus } from '../services/directMessageBus';

const JobDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state for the specific job to allow immediate UI updates
  const [localJob, setLocalJob] = useState<Job | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Sync with global storage on mount and when updates occur
  useEffect(() => {
    const saved = localStorage.getItem('trackcodex_offered_jobs');
    const offeredJobs = saved ? JSON.parse(saved) : [];
    const allJobs = [...MOCK_JOBS, ...offeredJobs];
    const found = allJobs.find(j => j.id === id);
    if (found) setLocalJob(found);
  }, [id]);

  const updateGlobalJobStore = (updatedJob: Job) => {
    const saved = localStorage.getItem('trackcodex_offered_jobs');
    let offeredJobs = saved ? JSON.parse(saved) : [];
    
    const isMock = MOCK_JOBS.some(mj => mj.id === updatedJob.id);
    
    if (isMock) {
       offeredJobs = [updatedJob, ...offeredJobs.filter((j: Job) => j.id !== updatedJob.id)];
    } else {
       offeredJobs = offeredJobs.map((j: Job) => j.id === updatedJob.id ? updatedJob : j);
    }
    
    localStorage.setItem('trackcodex_offered_jobs', JSON.stringify(offeredJobs));
    setLocalJob(updatedJob);
  };

  if (!localJob) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0d1117] text-center">
        <div className="size-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-6">
          <span className="material-symbols-outlined !text-[40px]">search_off</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Searching Mission Log...</h2>
        <button onClick={() => navigate('/dashboard/jobs')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px]">Back to Marketplace</button>
      </div>
    );
  }

  const handleStartWork = () => {
    if (localJob.status === 'Open' || localJob.status === 'Pending') {
      updateGlobalJobStore({ ...localJob, status: 'In Progress' });
    }
    navigate(`/workspace/${localJob.repoId}`);
  };

  const handleSubmitWork = () => {
    updateGlobalJobStore({ ...localJob, status: 'Pending Review' });
    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: {
        title: 'Work Submitted',
        message: 'The mission creator has been notified to review and finalize your work.',
        type: 'success'
      }
    }));
  };

  const handleCompleteJob = () => {
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    const comment = feedback || 'Great implementation and timely delivery.';
    const finalizedJob: Job = {
      ...localJob,
      status: 'Completed',
      rating,
      feedback: comment
    };
    
    updateGlobalJobStore(finalizedJob);
    setIsRatingModalOpen(false);
    
    // Reward Seeker profile (simulated as current user receiving a review)
    profileService.addJobRating(rating, comment, localJob.title, localJob.creator.name);

    window.dispatchEvent(new CustomEvent('trackcodex-notification', {
      detail: {
        title: 'Mission Finalized',
        message: 'Rating submitted and mission added to seeker history.',
        type: 'success'
      }
    }));
  };

  const handleMessageClient = () => {
    directMessageBus.openChat({
      id: localJob.creator.name.replace(/\s+/g, '').toLowerCase(),
      name: localJob.creator.name,
      avatar: localJob.creator.avatar,
      context: `Mission: ${localJob.title}`
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto custom-scrollbar font-display">
      <div className="px-8 py-6 border-b border-[#1e293b] bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/dashboard/jobs')}
                className="size-10 flex items-center justify-center bg-[#161b22] border border-[#30363d] rounded-xl text-slate-400 hover:text-white transition-all shadow-sm"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-2xl font-black text-white tracking-tight uppercase">{localJob.title}</h1>
                   <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest bg-opacity-5 ${
                     localJob.status === 'Open' ? 'border-emerald-500 text-emerald-500' : 
                     localJob.status === 'In Progress' ? 'border-amber-500 text-amber-500' : 
                     localJob.status === 'Pending Review' ? 'border-indigo-500 text-indigo-500 animate-pulse' :
                     localJob.status === 'Pending' ? 'border-blue-500 text-blue-500' :
                     'border-purple-500 text-purple-500'
                   }`}>
                     {localJob.status}
                   </span>
                 </div>
                 <p className="text-[11px] text-slate-500 font-mono uppercase tracking-widest">
                   {localJob.type} • Posted {localJob.postedDate} • Ref: {localJob.id}
                 </p>
              </div>
           </div>

           <div className="flex items-center gap-3">
             {localJob.status === 'Open' && (
               <button 
                onClick={handleStartWork}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
               >
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  Accept Mission
               </button>
             )}
             {localJob.status === 'In Progress' && (
               <div className="flex gap-3">
                <button 
                  onClick={handleStartWork}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all border border-border-dark hover:bg-slate-700 shadow-lg"
                >
                    <span className="material-symbols-outlined text-lg">terminal</span>
                    Continue Coding
                </button>
                <button 
                  onClick={handleSubmitWork}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-emerald-500/20"
                >
                    <span className="material-symbols-outlined text-lg">send</span>
                    Submit Work
                </button>
               </div>
             )}
             {localJob.status === 'Pending Review' && (
                <div className="flex gap-3">
                  <span className="px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                     <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                     Awaiting Employer Approval
                  </span>
                  <button 
                    onClick={handleCompleteJob}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-primary/20"
                  >
                     Review & Rate Seeker
                  </button>
                </div>
             )}
             {localJob.status === 'Completed' && (
                <div className="flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-[11px] font-black uppercase tracking-widest">
                   <span className="material-symbols-outlined !text-[18px]">verified</span>
                   Finalized & Paid
                </div>
             )}
           </div>
        </div>
      </div>

      <div className="p-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          
          <div className="space-y-12">
            {localJob.status === 'Completed' && localJob.feedback && (
              <section className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in zoom-in-95">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-emerald-500 filled">verified</span>
                       <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Seeker Performance Review</h3>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`material-symbols-outlined !text-xl ${star <= (localJob.rating || 5) ? 'text-amber-500 filled' : 'text-slate-700'}`}>star</span>
                        ))}
                    </div>
                 </div>
                 <p className="text-xl text-slate-200 italic leading-relaxed">"{localJob.feedback}"</p>
                 <div className="mt-8 flex items-center gap-4 text-xs font-black uppercase text-slate-500 tracking-widest pt-6 border-t border-white/5">
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500"></span> Reputation +25</span>
                    <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500"></span> Funds Transferred</span>
                 </div>
              </section>
            )}

            <section>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Mission Briefing</h2>
              <div className="prose prose-invert max-w-none">
                 <p className="text-lg text-slate-200 leading-relaxed font-medium">
                   {localJob.longDescription || localJob.description}
                 </p>
                 {localJob.personalNote && (
                   <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl italic relative overflow-hidden">
                      <span className="material-symbols-outlined absolute -right-4 -top-4 text-[100px] text-primary/5">format_quote</span>
                      <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2 not-italic">Note from {localJob.creator.name}:</p>
                      <p className="text-slate-300 relative z-10">"{localJob.personalNote}"</p>
                   </div>
                 )}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Required Capabilities</h3>
              <div className="flex flex-wrap gap-3">
                 {localJob.techStack.map(skill => (
                   <span key={skill} className="px-5 py-2.5 bg-[#161b22] border border-[#30363d] rounded-xl text-[13px] font-bold text-slate-300 hover:border-primary/50 transition-all cursor-default">
                     {skill}
                   </span>
                 ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Associated Repository</h3>
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 group hover:border-primary/40 transition-all cursor-pointer shadow-lg relative overflow-hidden" onClick={() => navigate(`/repo/${localJob.repoId}`)}>
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-[100px]">account_tree</span>
                 </div>
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="material-symbols-outlined !text-[36px]">terminal</span>
                       </div>
                       <div>
                          <p className="text-xl font-black text-white group-hover:text-primary transition-colors">{localJob.repoId}</p>
                          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">Target Cloud Infrastructure Workspace</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Synced</span>
                       <span className="text-[11px] font-bold text-primary group-hover:underline">View Source File Explorer</span>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          <aside className="space-y-10">
            <div className="p-8 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                  <span className="material-symbols-outlined text-[100px] text-white">payments</span>
               </div>
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Mission Value</h3>
               <div className="space-y-8">
                  <div>
                     <p className="text-4xl font-black text-white tracking-tighter mb-1">{localJob.budget}</p>
                     <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest">Total Contract Payout</p>
                  </div>
                  <div className="pt-8 border-t border-white/5 space-y-4">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold uppercase">Budget Type</span>
                        <span className="text-white font-black">{localJob.type}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold uppercase">Escrow Protocol</span>
                        <span className="text-emerald-500 font-black">Secured</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-xl relative ring-1 ring-white/5">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Contracting Client</h3>
               <div className="flex items-center gap-5 mb-8">
                  <img src={localJob.creator.avatar} className="size-16 rounded-2xl border-2 border-primary/20 object-cover shadow-lg" alt="Client" />
                  <div>
                    <p className="text-lg font-black text-white leading-tight uppercase">{localJob.creator.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                       <span className="material-symbols-outlined text-amber-500 filled !text-[16px]">star</span>
                       <span className="text-xs font-black text-slate-300">4.9 <span className="text-slate-600 font-bold ml-1">(12 missions)</span></span>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleMessageClient}
                    className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] hover:border-primary/50 text-slate-400 hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Send DM
                  </button>
                  <button className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Profile
                  </button>
               </div>
            </div>
          </aside>
        </div>
      </div>

      <JobRatingModal 
        isOpen={isRatingModalOpen} 
        onClose={() => setIsRatingModalOpen(false)} 
        onSubmit={handleRatingSubmit} 
      />
    </div>
  );
};

export default JobDetailView;
