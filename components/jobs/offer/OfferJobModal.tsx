
import React, { useState } from 'react';
import { MOCK_REPOS } from '../../../constants';
import { Job } from '../../../types';
import { jobOfferService } from '../../../services/jobOfferService';

interface OfferJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: { name: string; username: string };
}

const OfferJobModal: React.FC<OfferJobModalProps> = ({ isOpen, onClose, targetUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    type: 'Contract' as Job['type'],
    techStack: '',
    personalNote: '',
    repoId: MOCK_REPOS[0].id
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const techStackArray = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
    
    jobOfferService.createOffer({
      ...formData,
      techStack: techStackArray,
      targetUserId: targetUser.username
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#161b22] border border-[#30363d] w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col font-display">
        <div className="p-6 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined text-2xl">work</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Offer Job to @{targetUser.username}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Secure Freelance Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-white/5 text-slate-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Job Mission Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Lead Smart Contract Auditor"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Budget / Rate</label>
                 <input 
                   required
                   value={formData.budget}
                   onChange={e => setFormData({...formData, budget: e.target.value})}
                   placeholder="$5,000 / Fixed"
                   className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                 />
               </div>
               <div>
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Contract Type</label>
                 <select 
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value as Job['type']})}
                   className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                 >
                   <option value="Contract">Contract</option>
                   <option value="Gig">Gig</option>
                   <option value="Full-time">Full-time</option>
                 </select>
               </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Personal Note to Developer</label>
              <textarea 
                value={formData.personalNote}
                onChange={e => setFormData({...formData, personalNote: e.target.value})}
                placeholder="Hey, I saw your work on rust-crypto-guard and would love for you to help us with..."
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none h-24 resize-none"
              />
            </div>

            <div>
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Linked Repository</label>
              <select 
                value={formData.repoId}
                onChange={e => setFormData({...formData, repoId: e.target.value})}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
              >
                {MOCK_REPOS.map(repo => (
                  <option key={repo.id} value={repo.id}>{repo.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#30363d]">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Discard</button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                 <>
                   <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                   Sending...
                 </>
              ) : (
                'Send Job Offer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferJobModal;
