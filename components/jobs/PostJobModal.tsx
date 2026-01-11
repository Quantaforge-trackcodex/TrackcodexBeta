
import React, { useState, useEffect } from 'react';
import { MOCK_REPOS } from '../../constants';
import { Job } from '../../types';
import { GoogleGenAI } from "@google/genai";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newJob: Partial<Job>) => void;
  initialData?: any;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    type: 'Contract' as Job['type'],
    techStack: '',
    repoId: MOCK_REPOS[0].id
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        title: initialData.title || prev.title,
        repoId: initialData.repoId || prev.repoId,
        techStack: initialData.techStack || prev.techStack,
        description: initialData.description || prev.description
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const techStackArray = Array.isArray(formData.techStack) 
      ? formData.techStack 
      : formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
    
    onSubmit({
      ...formData,
      techStack: techStackArray,
      status: 'Open',
      postedDate: 'Just now',
      creator: {
        name: 'Alex Chen',
        avatar: 'https://picsum.photos/seed/alexprofile/64'
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#161b22] border border-primary/30 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-[#30363d] bg-primary/5">
           <h3 className="text-xl font-black text-white tracking-tight uppercase">Launch Expert Mission</h3>
           <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Linked to infrastructure in {formData.repoId}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-4">
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Mission Title"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
              />
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Technical Briefing"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white h-32 resize-none outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  placeholder="Budget (e.g. $1,200)"
                  className="bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none"
                />
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                  className="bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none appearance-none"
                >
                  <option value="Contract">Contract</option>
                  <option value="Gig">Gig</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>
           </div>
           
           <div className="flex items-center gap-3 pt-6 border-t border-[#30363d]">
             <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Discard Draft</button>
             <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Publish Mission</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;
