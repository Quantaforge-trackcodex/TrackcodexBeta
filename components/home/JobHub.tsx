
import React from 'react';

const JobHub = () => {
  const jobs = [
    { 
      title: 'React & Rust Security Audit', 
      desc: 'Looking for a specialist to audit our new authentication flow built with...', 
      pay: '$85/hr',
      tags: ['Remote', 'Contract']
    },
    { 
      title: 'Frontend Lead (Vue.js)', 
      desc: 'Full-time role for a security-focused frontend architect...', 
      pay: '$120k - $140k',
      tags: ['Full-time']
    }
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl divide-y divide-[#30363d] overflow-hidden">
      {jobs.map((job, i) => (
        <div key={i} className="p-5 hover:bg-primary/5 transition-all cursor-pointer group">
           <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{job.title}</h4>
              <span className="text-emerald-400 text-xs font-black bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{job.pay}</span>
           </div>
           <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed mb-4">{job.desc}</p>
           <div className="flex gap-2">
              {job.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-[#0d1117] text-slate-500 text-[9px] font-black uppercase tracking-widest rounded border border-[#30363d]">
                   {tag}
                </span>
              ))}
           </div>
        </div>
      ))}
    </div>
  );
};

export default JobHub;
