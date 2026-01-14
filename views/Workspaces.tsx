import React, { useState } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useNavigate } from 'react-router-dom';
import { Workspace } from '../types';
import Spinner from '../components/ui/Spinner';

const WorkspaceCard: React.FC<{ workspace: Workspace }> = ({ workspace }) => {
  const navigate = useNavigate();
  const isActive = workspace.status === 'Running';
  
  return (
    <div className={`group bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col ${!isActive ? 'opacity-75' : ''}`}>
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-2xl">terminal</span>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-white group-hover:text-primary transition-colors">{workspace.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>{workspace.status}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="material-symbols-outlined text-base">account_tree</span>
            <span className="truncate">{workspace.repo}</span>
          </div>
        </div>
      </div>
      <div className="p-3 bg-black/20 border-t border-[#30363d] grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-[#2d333b] border border-[#30363d] rounded-lg hover:bg-slate-700 transition-colors">
          {isActive ? 'Stop' : 'Start'}
        </button>
        <button 
          onClick={() => navigate(`/workspace/${workspace.id}`)}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open
        </button>
      </div>
    </div>
  );
};

const Workspaces = () => {
  const navigate = useNavigate();
  const { workspaces, loading, error } = useWorkspaces();
  const [filter, setFilter] = useState('All');
  
  if (loading) return <div className="p-20 text-center"><Spinner size="lg" /></div>;

  const filteredWorkspaces = workspaces.filter(ws => {
    if (filter === 'Active') return ws.status === 'Running';
    if (filter === 'Stopped') return ws.status === 'Stopped';
    return true;
  });

  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Workspaces</h1>
          <p className="text-slate-400 text-sm">Manage and launch your cloud development environments.</p>
        </div>
        <button 
          onClick={() => navigate('/workspace/new')}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkspaces.map(ws => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        ))}
      </div>
    </div>
  );
};

export default Workspaces;