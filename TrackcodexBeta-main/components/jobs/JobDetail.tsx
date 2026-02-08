
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import JobRatingModal from './JobRatingModal';
import { profileService } from '../../services/profile';

const JobDetail = ({ job, onBack }: { job: Job, onBack: () => void }) => {
  const navigate = useNavigate();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(job.status);
  const [submittedFeedback, setSubmittedFeedback] = useState<string | null>(job.feedback || null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(job.rating || null);

  const handleStartWork = () => {
    // Linked flow: navigate to the repository's workspace
    // job.repoId maps to a Workspace ID in our mock system
    navigate(`/workspace/${job.repoId}`);
  };

  const handleCompleteJob = () => {
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    setCurrentStatus('Completed');
    setSubmittedRating(rating);
    setSubmittedFeedback(feedback || 'Great implementation and timely delivery.');
    setIsRatingModalOpen(false);

    // Link to profile: Update the seeker's (current user's) rating and job count
    profileService.addJobRating(rating);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117] animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto custom-scrollbar">
      <div className="px-8 pt-6 pb-6 border-b border-[#1e293b] bg-[#0d1117] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="size-10 flex items-center justify-center bg-[#161b22] border border-[#30363d] rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                {job.title}
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest bg-opacity-5 ${currentStatus === 'Open' ? 'border-emerald-500 text-emerald-500' :
                    currentStatus === 'In Progress' ? 'border-amber-500 text-amber-500' : 'border-purple-500 text-purple-500'
                  }`}>
                  {currentStatus}
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Posted {job.postedDate} • {job.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentStatus === 'Open' && (
              <button
                onClick={handleStartWork}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                Accept & Open Workspace
              </button>
            )}
            {currentStatus === 'In Progress' && (
              <div className="flex gap-3">
                <button
                  onClick={handleStartWork}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all border border-border-dark hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                  Continue to Workspace
                </button>
                <button
                  onClick={handleCompleteJob}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/20"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Complete Job
                </button>
              </div>
            )}
            {currentStatus === 'Completed' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-black uppercase tracking-widest">
                <span className="material-symbols-outlined !text-[18px]">verified</span>
                Finalized & Paid
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Job Description</h2>
              <p className="text-base text-slate-300 leading-relaxed">
                {job.longDescription || job.description}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl text-sm font-bold text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {currentStatus === 'Completed' && (
              <section className="p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl animate-in slide-in-from-bottom-2">
                <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined !text-[18px]">reviews</span>
                  Employer Feedback for Seeker
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`material-symbols-outlined !text-xl ${star <= (submittedRating || 5) ? 'text-amber-500 filled' : 'text-slate-700'}`}>star</span>
                  ))}
                </div>
                <p className="text-slate-300 italic">"{submittedFeedback}"</p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Reputation scores updated on seeker profile</p>
                </div>
              </section>
            )}

            <section className="bg-[#161b22] border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">account_tree</span>
              </div>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Associated Workspace</h3>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <span className="material-symbols-outlined !text-3xl">terminal</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white group-hover:text-primary transition-colors">{job.repoId}</p>
                    <p className="text-xs text-slate-500">Cloud Development Environment (Synced with {job.repoId})</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="text-xs font-bold text-primary hover:underline" onClick={() => navigate(`/repo/${job.repoId}`)}>View Source</button>
                  <button className="text-xs font-bold text-emerald-500 hover:underline" onClick={handleStartWork}>Open Workspace</button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Financial Summary</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Budget Type</span>
                  <span className="text-white font-bold">{job.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Estimated Total</span>
                  <span className="text-2xl font-black text-emerald-500">{job.budget}</span>
                </div>
                <div className="pt-4 border-t border-[#30363d]">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Escrow Payment Verified
                  </div>
                  <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                    Job Conditions
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">About the Client</h3>
              <div className="flex items-center gap-3 mb-6">
                <img src={job.creator.avatar} className="size-12 rounded-full border border-border-dark" />
                <div>
                  <p className="text-sm font-bold text-white">{job.creator.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 filled !text-[14px]">star</span>
                    <span className="text-xs font-bold text-slate-400">4.9 (12 hires)</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 bg-transparent border border-[#30363d] text-slate-500 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                View Client Profile
              </button>
            </div>
          </div>
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

export default JobDetail;
