
import React, { useState, useMemo } from 'react';
import { MOCK_TRIAL_REPOS } from '../../constants';
import { TrialRepo } from '../../types';

// Helper function to extract the max salary for sorting
const getMaxSalary = (salaryRange: string): number => {
    // Finds the last number in a string like "$180k - $240k" or "£160k"
    const numbers = salaryRange.match(/[\d,.]+/g);
    if (!numbers) return 0;
    
    const lastNumberStr = numbers[numbers.length - 1].replace(/,/g, '');
    let value = parseFloat(lastNumberStr);

    if (salaryRange.toLowerCase().includes('k')) {
        value *= 1000;
    }

    return value;
};

// FIX: Changed component to React.FC to correctly handle the 'key' prop when used in a list.
const TrialCard: React.FC<{ trial: TrialRepo }> = ({ trial }) => {
    const isStripe = trial.company === 'Stripe';

    return (
        <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 flex flex-col group hover:border-gh-text-secondary transition-all shadow-md hover:shadow-xl">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-gh-bg border border-gh-border rounded-lg flex items-center justify-center p-1">
                        {isStripe ? (
                            <div className="size-full bg-[#008cdd] rounded-md flex items-center justify-center text-white text-2xl font-black">S</div>
                        ) : (
                            <img src={trial.logo} className="h-full w-auto object-contain invert-[.85]" alt={trial.company} />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-primary transition-colors text-base">{trial.title}</h3>
                        <p className="text-xs text-slate-400">{trial.company} • {trial.location} • {trial.salaryRange}</p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border whitespace-nowrap ${trial.status === 'Newly Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {trial.status.toUpperCase()}
                </span>
            </div>

            <div className="my-4 flex-1">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Codebase Challenge</h4>
                <p className="text-lg text-slate-200 font-medium">"{trial.description}"</p>
            </div>
            
            <div className="flex flex-wrap gap-2 my-4">
                {trial.tech.map(t => <span key={t} className="px-2 py-1 text-[11px] bg-gh-bg border border-gh-border rounded font-bold text-slate-400">{t}</span>)}
            </div>
            
            <div className="mt-auto pt-4 border-t border-gh-border flex items-center justify-start gap-3">
                <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/10 transition-transform hover:scale-105 active:scale-100">Fork & Start Trial</button>
                <button className="px-4 py-2 text-xs font-bold text-slate-300 border border-gh-border rounded-lg hover:border-slate-400 hover:bg-gh-bg">View Specs</button>
            </div>
        </div>
    );
};

const TrialRepositoriesView = () => {
    const [sortOrder, setSortOrder] = useState<'newest' | 'highestPay'>('newest');

    const sortedTrials = useMemo(() => {
        const trialsCopy = [...MOCK_TRIAL_REPOS];
        if (sortOrder === 'newest') {
            // Sort 'Newly Active' before 'Updated'
            return trialsCopy.sort((a, b) => {
                if (a.status === 'Newly Active' && b.status !== 'Newly Active') return -1;
                if (b.status === 'Newly Active' && a.status !== 'Newly Active') return 1;
                return 0;
            });
        }
        if (sortOrder === 'highestPay') {
            return trialsCopy.sort((a, b) => getMaxSalary(b.salaryRange) - getMaxSalary(a.salaryRange));
        }
        return trialsCopy;
    }, [sortOrder]);

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Trial Repositories</h2>
                        <p className="text-sm text-slate-400 mt-1">A real-world task to prove your skills. No algorithm puzzles allowed.</p>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-gh-bg-secondary border border-gh-border">
                         <button 
                            onClick={() => setSortOrder('newest')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${sortOrder === 'newest' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                         >
                            Sort: Newest
                         </button>
                         <button 
                            onClick={() => setSortOrder('highestPay')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${sortOrder === 'highestPay' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                         >
                            Sort: Highest Pay
                         </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {sortedTrials.map(trial => <TrialCard key={trial.id} trial={trial} />)}
                </div>
            </div>
        </div>
    );
};

export default TrialRepositoriesView;
