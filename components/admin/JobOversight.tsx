
import React from 'react';

const JobOversight = () => {
  const jobs = [
    { id: 'j1', title: 'DeFi Audit', seeker: 'Alex Chen', employer: 'SolanaLend', value: '$8,500', status: 'Escrow', risk: 'Low' },
    { id: 'j2', title: 'UX Redesign', seeker: 'Sarah C.', employer: 'AnalyticsPro', value: '$3,200', status: 'In-Review', risk: 'Medium' },
    { id: 'j3', title: 'Go Backend', seeker: 'Marcus J.', employer: 'TrackCodex', value: '$160k/y', status: 'Interview', risk: 'Low' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Job Oversight</h1>
          <p className="text-slate-500">Monitor financial transactions, escrow status, and resolve marketplace disputes.</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0d0d0f] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#30363d]">
              <th className="px-6 py-4">Job Mission</th>
              <th className="px-6 py-4">Counterparties</th>
              <th className="px-6 py-4">Contract Value</th>
              <th className="px-6 py-4">Lifecycle</th>
              <th className="px-6 py-4 text-right">Ops Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                   <p className="text-sm font-bold text-white">{job.title}</p>
                   <p className="text-[10px] text-slate-600 font-mono">#{job.id}</p>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="text-xs text-primary font-bold">@{job.seeker.split(' ')[0].toLowerCase()}</span>
                      <span className="text-[10px] text-slate-500">Hire: {job.employer}</span>
                   </div>
                </td>
                <td className="px-6 py-5 font-black text-white text-sm">{job.value}</td>
                <td className="px-6 py-5">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/20">{job.status}</span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white text-[9px] font-black uppercase tracking-widest border border-amber-500/20 transition-all">Freeze</button>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest border border-rose-500/20 transition-all">Escalate</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobOversight;
