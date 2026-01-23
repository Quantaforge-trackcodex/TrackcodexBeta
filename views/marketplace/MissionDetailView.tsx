import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../../constants';
import { Job } from '../../types';
import JobRatingModal from '../../components/jobs/JobRatingModal';
import { profileService } from '../../services/profile';
import { directMessageBus } from '../../services/directMessageBus';

const MissionDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [localJob, setLocalJob] = useState<Job | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    let offeredJobs: Job[] = [];
    try {
        const saved = localStorage.getItem('trackcodex_offered_jobs');
        if (saved) {
            offeredJobs = JSON.parse(saved);
        }
    } catch (e) {
        console.error("Failed to parse offered jobs from localStorage", e);
    }
    const allJobs = [...MOCK_JOBS, ...offeredJobs];
    const found = allJobs.find(j => j.id === id);
    if (found) setLocalJob(found);
  }, [id]);

  if (!localJob) return <div className="p-8 text-center text-slate-400">Mission not found.</div>;

  const handleStartWork = () => navigate(`/workspace/${localJob.repoId}`);
  const handleMessageClient = () => {
    directMessageBus.openChat({
      id: localJob.creator.name.replace(/\s+/g, '').toLowerCase(),
      name: localJob.creator.name,
      avatar: localJob.creator.avatar,
      context: `Mission: ${localJob.title}`
    });
  };
  const handleRatingSubmit = (rating: number, feedback: string) => {
    // This logic would typically live on a backend
    setIsRatingModalOpen(false);
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
        <div className="space-y-12">
            <section>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Mission Briefing</h2>
              <div className="prose prose-invert max-w-none"><p className="text-lg text-slate-200 leading-relaxed font-medium">{localJob.longDescription || localJob.description}</p></div>
            </section>
            <section>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Required Capabilities</h3>
              <div className="flex flex-wrap gap-3">{localJob.techStack.map(skill => (<span key={skill} className="px-5 py-2.5 bg-[#161b22] border border-[#30363d] rounded-xl text-[13px] font-bold text-slate-300">{skill}</span>))}</div>
            </section>
        </div>
        <aside className="space-y-10">
            <div className="p-8 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-2xl">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Mission Value</h3>
                <div>
                    <p className="text-4xl font-black text-white tracking-tighter mb-1">{localJob.budget}</p>
                    <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest">Total Contract Payout</p>
                </div>
            </div>
             <div className="p-8 rounded-3xl bg-[#161b22] border border-[#30363d] shadow-xl">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Contracting Client</h3>
               <div className="flex items-center gap-5 mb-8">
                  <img src={localJob.creator.avatar} className="size-16 rounded-2xl border-2 border-primary/20 object-cover" alt="Client" />
                  <div>
                    <p className="text-lg font-black text-white leading-tight uppercase">{localJob.creator.name}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleMessageClient} className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] text-slate-400 rounded-xl text-[10px] font-black uppercase">Send DM</button>
                  <button className="flex-1 py-3 bg-[#0d1117] border border-[#30363d] text-slate-400 rounded-xl text-[10px] font-black uppercase">Profile</button>
               </div>
            </div>
        </aside>
      </div>
       <JobRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} onSubmit={handleRatingSubmit} />
    </div>
  );
};

export default MissionDetailView;