
import React, { useState } from 'react';

const JobRatingModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (rating: number, feedback: string) => void }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#161b22] border border-primary/30 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-[#30363d] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Rate the Engineer</h3>
            <p className="text-xs text-slate-500 mt-1">Submit a review to complete the job and release funds.</p>
          </div>
          <button onClick={onClose} className="size-10 rounded-full flex items-center justify-center hover:bg-white/5 text-slate-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality of Work</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`size-12 rounded-xl border flex items-center justify-center transition-all ${
                    rating >= star ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-[#30363d] bg-[#0d1117] text-slate-700'
                  }`}
                >
                  <span className={`material-symbols-outlined !text-3xl ${rating >= star ? 'filled' : ''}`}>star</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Detailed Feedback</label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="How was the collaboration experience? (Optional)"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 text-sm text-slate-200 focus:ring-1 focus:ring-primary outline-none h-32 resize-none"
            />
          </div>
        </div>

        <div className="p-6 bg-[#0d1117] border-t border-[#30363d] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">Discard</button>
          <button 
            onClick={() => onSubmit(rating, feedback)}
            className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-primary/20"
          >
            Submit & Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobRatingModal;
