
import React from 'react';
import { MOCK_SECURITY_ALERTS } from '../constants';

const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles: any = {
    Critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const SecurityView = () => {
  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Security Dashboard</h1>
          <p className="text-slate-400">Monitor and resolve infrastructure vulnerabilities.</p>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          Trigger Manual Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: 12, change: '+2 from last week', color: 'bg-red-500' },
          { label: 'High', count: 28, change: 'No change', color: 'bg-orange-500' },
          { label: 'Medium', count: 45, change: '-8 resolved', color: 'bg-amber-500' },
          { label: 'Health Score', count: '84%', change: 'Last scan: 14m ago', color: 'bg-emerald-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-dark p-5 rounded-xl border border-border-dark relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}></div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold">{stat.count}</h3>
            <p className={`text-[10px] mt-4 flex items-center gap-1 ${stat.change.includes('+') ? 'text-red-500' : 'text-slate-400'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 bg-surface-dark rounded-xl border border-border-dark overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border-dark flex items-center justify-between">
            <h2 className="font-bold text-lg">DAST Alerts</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#1c1d24] text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Vulnerability</th>
                <th className="px-6 py-4">Repository</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {MOCK_SECURITY_ALERTS.map(alert => (
                <tr key={alert.id} className="hover:bg-white/[0.02] cursor-pointer transition-colors group">
                  <td className="px-6 py-4"><SeverityBadge severity={alert.severity} /></td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold group-hover:text-primary">{alert.vulnerability}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {alert.id}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{alert.repository}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full xl:w-[420px] bg-surface-dark rounded-xl border border-primary/30 flex flex-col overflow-hidden relative shadow-2xl">
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase bg-primary/10 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              ForgeAI
            </div>
          </div>
          <div className="p-6 border-b border-border-dark">
            <h3 className="text-lg font-bold">ForgeAI Suggested Fix</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Detected unsanitized user input in the DOM. ForgeAI recommends using DOMPurify.
            </p>
          </div>
          <div className="flex-1 bg-slate-950 p-4 font-mono text-[11px] overflow-hidden">
            <div className="text-slate-500 mb-2">// src/components/UserDisplay.tsx</div>
            <div className="bg-red-900/40 text-red-200 -mx-4 px-4 py-0.5 border-l-2 border-red-500">- &lt;div dangerouslySetInnerHTML=&#123;&#123; __html: data.bio &#125;&#125; /&gt;</div>
            <div className="bg-green-900/40 text-green-200 -mx-4 px-4 py-0.5 border-l-2 border-emerald-500">+ &lt;div&gt;&#123;sanitize(data.bio)&#125;&lt;/div&gt;</div>
          </div>
          <div className="p-6 bg-slate-900/50 space-y-4">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">rocket_launch</span>
              Apply Fix & Re-run Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityView;
