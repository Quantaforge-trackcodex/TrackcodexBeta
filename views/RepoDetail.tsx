
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPOS } from '../constants';
import { forgeAIService } from '../services/gemini';

const MOCK_COMMITS = [
  { id: '9a8b7c6', message: 'feat: update dependency versions and fix types', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', date: '3 hours ago' },
  { id: '5f4e3d2', message: 'refactor: optimize database queries for better performance', author: 'sarah-coder', avatar: 'https://picsum.photos/seed/sarah/32', date: '2 days ago' },
  { id: '1a2b3c4', message: 'chore: add new favicon assets', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', date: '1 week ago' },
  { id: 'e5f6g7h', message: 'docs: update installation instructions', author: 'mike-doc', avatar: 'https://picsum.photos/seed/mike/32', date: '2 weeks ago' },
  { id: 'h7g6f5e', message: 'fix: resolve race condition in auth middleware', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', date: '1 month ago' },
];

const MOCK_PULL_REQUESTS = [
  { id: '#458', title: 'feat: implement two-factor authentication flow', author: 'sarah-coder', avatar: 'https://picsum.photos/seed/sarah/32', status: 'Open', ci: 'Passing', date: '5 hours ago', labels: ['Security', 'Critical'] },
  { id: '#457', title: 'fix: resolve memory leak in websocket handler', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', status: 'Open', ci: 'Failing', date: '1 day ago', labels: ['Bug', 'Performance'] },
  { id: '#456', title: 'chore: bump dependencies to v2.4.0', author: 'github-actions', avatar: 'https://picsum.photos/seed/ai/64', status: 'Merged', ci: 'Passing', date: '2 days ago', labels: ['Chore'] },
  { id: '#455', title: 'docs: add architecture decision records', author: 'mike-doc', avatar: 'https://picsum.photos/seed/mike/32', status: 'Merged', ci: 'Passing', date: '4 days ago', labels: ['Docs'] },
];

const MOCK_WORKFLOW_RUNS = [
  { id: 'w1', name: 'CI Pipeline', status: 'Success', runNumber: '#124', branch: 'main', time: '2 hours ago', duration: '1m 24s', author: 'alex-dev', event: 'push' },
  { id: 'w2', name: 'Security Scan', status: 'Running', runNumber: '#125', branch: 'feat/auth-v2', time: '10 mins ago', duration: '--', author: 'sarah-coder', event: 'pull_request' },
  { id: 'w3', name: 'Deployment to Staging', status: 'Failed', runNumber: '#123', branch: 'main', time: '5 hours ago', duration: '45s', author: 'alex-dev', event: 'push' },
  { id: 'w4', name: 'Lint & Test', status: 'Success', runNumber: '#122', branch: 'main', time: 'Yesterday', duration: '2m 10s', author: 'mike-doc', event: 'push' },
  { id: 'w5', name: 'Nightly Build', status: 'Success', runNumber: '#121', branch: 'main', time: '2 days ago', duration: '1m 18s', author: 'github-actions', event: 'schedule' },
];

const WorkflowRunDetail = ({ run, onBack }: { run: any, onBack: () => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleDiagnose = async () => {
    setAnalyzing(true);
    try {
      const mockLogs = "Error: Process completed with exit code 1. \n FAIL tests/auth.test.ts > login flow \n Expected '200' but got '401'. \n Missing AUTH_SECRET environment variable.";
      const result = await forgeAIService.getSecurityFix("CI/CD Build Failure Diagnosis", mockLogs);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("AI analysis failed. Please check logs manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
          <span className="text-sm font-bold">Back to all runs</span>
        </button>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all">Re-run all jobs</button>
           <button className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Cancel run</button>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center ${
              run.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : 
              run.status === 'Failed' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              <span className={`material-symbols-outlined !text-[28px] ${run.status === 'Running' ? 'animate-spin' : 'filled'}`}>
                {run.status === 'Success' ? 'check_circle' : run.status === 'Failed' ? 'cancel' : 'progress_activity'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                {run.name}
                <span className="text-slate-500 font-normal">{run.runNumber}</span>
              </h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                <span className="flex items-center gap-1 font-mono text-xs bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                  <span className="material-symbols-outlined !text-[14px]">account_tree</span>
                  {run.branch}
                </span>
                <span>•</span>
                <span>Run by <span className="text-white font-bold">{run.author}</span></span>
                <span>•</span>
                <span>{run.time}</span>
              </div>
            </div>
          </div>
          {run.status === 'Failed' && (
            <button 
              onClick={handleDiagnose}
              disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-blue-600 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <span className={`material-symbols-outlined !text-[18px] ${analyzing ? 'animate-spin' : 'filled'}`}>
                {analyzing ? 'progress_activity' : 'auto_awesome'}
              </span>
              {analyzing ? 'Diagnosing...' : 'Diagnose with ForgeAI'}
            </button>
          )}
        </div>

        {analysis && (
          <div className="mb-8 p-5 bg-primary/5 border border-primary/30 rounded-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="material-symbols-outlined !text-[16px] filled">auto_awesome</span>
              ForgeAI Root Cause Analysis
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              {analysis}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Jobs</h3>
            <div className="space-y-2">
              {['Build Application', 'Unit Tests', 'Security Scan', 'Static Analysis'].map((job, i) => (
                <div key={job} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  i === 0 ? 'bg-[#0d1117] border-primary/50 text-white' : 'bg-transparent border-[#30363d] text-slate-400 hover:bg-white/5'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined !text-[18px] ${
                      run.status === 'Failed' && i === 1 ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {run.status === 'Failed' && i === 1 ? 'cancel' : 'check_circle'}
                    </span>
                    <span className="text-xs font-bold">{job}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600">45s</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col min-h-[400px]">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Logs: Build Application</h3>
            <div className="flex-1 bg-[#090d13] border border-[#30363d] rounded-2xl p-6 font-mono text-[12px] text-slate-400 overflow-y-auto custom-scrollbar shadow-inner">
               <div className="space-y-1">
                  <p className="text-slate-600">2024-03-24T10:30:12.450Z Initializing environment...</p>
                  <p className="text-slate-600">2024-03-24T10:30:13.120Z Loading project metadata...</p>
                  <p>2024-03-24T10:30:14.005Z <span className="text-emerald-500">✓</span> Repository fetched</p>
                  <p>2024-03-24T10:30:15.890Z <span className="text-emerald-500">✓</span> Node modules installed from cache</p>
                  <p>2024-03-24T10:30:16.442Z Running: <span className="text-white">npm run build</span></p>
                  <p className="text-slate-500">Compiling typescript files...</p>
                  <p className="text-slate-500">Bundling assets for production...</p>
                  {run.status === 'Failed' ? (
                    <p className="text-rose-500 mt-4 font-bold bg-rose-500/10 -mx-6 px-6 py-2 border-l-4 border-rose-500">
                      Error: Build failed. Check stderr for details.
                    </p>
                  ) : (
                    <p className="text-emerald-500 mt-4 font-bold bg-emerald-500/10 -mx-6 px-6 py-2 border-l-4 border-emerald-500">
                      Success: Build artifacts generated in dist/
                    </p>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RepoDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const repo = MOCK_REPOS.find(r => r.id === id) || MOCK_REPOS[0];

  const [activeTab, setActiveTab] = useState('Code');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const startQuickEdit = (fileName: string) => {
    const mockContent = fileName === 'package.json' 
      ? `{\n  "name": "trackcodex-api",\n  "version": "2.4.0",\n  "main": "index.js",\n  "dependencies": {\n    "express": "^4.18.2",\n    "google-cloud": "^1.0.0"\n  }\n}`
      : `import { auth } from './middleware';\n\nexport const handler = async (req, res) => {\n  const user = await auth.validate(req);\n  return res.json({\n    success: true,\n    user: user,\n    timestamp: new Date().toISOString()\n  });\n};`;
    
    setFileContent(mockContent);
    setEditingFile(fileName);
    setActiveTab('Code');
  };

  const handleCommit = (newContent: string) => {
    setIsCommitting(true);
    setTimeout(() => {
      setEditingFile(null);
      setIsCommitting(false);
      alert(`Changes to ${editingFile} committed successfully!`);
    }, 1200);
  };

  const tabs = ['Code', 'Commits', 'Issues', 'Pull Requests', 'GitHub Actions', 'Insights', 'Settings'];

  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <span className="material-symbols-outlined text-emerald-500 !text-xl filled">check_circle</span>;
      case 'Failed': return <span className="material-symbols-outlined text-rose-500 !text-xl filled">cancel</span>;
      case 'Running': return <span className="material-symbols-outlined text-blue-500 !text-xl animate-spin">progress_activity</span>;
      default: return <span className="material-symbols-outlined text-slate-500 !text-xl">circle</span>;
    }
  };

  const getPRStatusStyle = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-primary/10 text-primary border-primary/30';
      case 'Merged': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Closed': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-400 border-border-dark';
    }
  };

  const selectedRun = MOCK_WORKFLOW_RUNS.find(r => r.id === selectedRunId);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500 !text-2xl">book</span>
            <div className="flex items-center gap-2">
              <span className="text-xl text-[#58a6ff] hover:underline cursor-pointer font-medium" onClick={() => navigate('/repositories')}>track-codex</span>
              <span className="text-xl text-slate-400">/</span>
              <span className="text-xl text-white font-bold">{repo.name}</span>
              <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] text-slate-500 font-bold uppercase tracking-wider">{repo.visibility}</span>
              
              <button 
                onClick={() => { setActiveTab('Pull Requests'); setSelectedRunId(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ml-2 group border ${
                    activeTab === 'Pull Requests' 
                    ? 'bg-primary text-white border-primary/50 shadow-lg shadow-primary/20' 
                    : 'bg-surface-dark border-border-dark text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                <span className="material-symbols-outlined !text-[16px] group-hover:scale-110 transition-transform">fork_right</span>
                <span className="text-[11px] font-bold">8 Pull Requests</span>
              </button>

              <button 
                onClick={() => navigate('/workspace/new')}
                className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 border border-primary/20"
              >
                <span className="material-symbols-outlined !text-[16px]">terminal</span>
                Open in Workspace
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold hover:bg-[#21262d] transition-colors">
               <span className="material-symbols-outlined !text-[18px]">visibility</span>
               Watch <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-slate-400">12</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold hover:bg-[#21262d] transition-colors">
               <span className="material-symbols-outlined !text-[18px]">star</span>
               Star <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-slate-400">{repo.stars}</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold hover:bg-[#21262d] transition-colors">
               <span className="material-symbols-outlined !text-[18px]">fork_right</span>
               Fork <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-slate-400">{repo.forks}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-[#30363d] mb-8 overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <div 
               key={tab} 
               onClick={() => { setActiveTab(tab); setEditingFile(null); setSelectedRunId(null); }}
               className={`flex items-center gap-2 px-3 py-3 text-[13px] border-b-2 transition-colors cursor-pointer shrink-0 ${activeTab === tab ? 'text-white border-[#f78166] font-bold' : 'text-slate-400 border-transparent hover:text-white'}`}
             >
                <span className="material-symbols-outlined !text-[18px]">{
                  tab === 'Code' ? 'code' : 
                  tab === 'Commits' ? 'history' :
                  tab === 'Issues' ? 'error' : 
                  tab === 'Pull Requests' ? 'fork_right' : 
                  tab === 'GitHub Actions' ? 'play_circle' : 
                  tab === 'Insights' ? 'insights' : 'settings'
                }</span>
                {tab}
                {(tab === 'Issues' || tab === 'Pull Requests') && <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-[11px] font-bold">{tab === 'Issues' ? '24' : '8'}</span>}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
           <div className="space-y-6 min-w-0">
              {activeTab === 'Code' && (
                <>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="https://picsum.photos/seed/alex/32" className="size-6 rounded-full border border-[#30363d]" alt="Alex" />
                          <p className="text-[13px] text-slate-300"><span className="font-bold text-white hover:underline cursor-pointer">alex-dev</span> feat: update dependency versions and fix t...</p>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-slate-500">
                          <span className="font-mono text-[10px] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">9a8b7c6</span>
                          <span>3 hours ago</span>
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-[#30363d]">
                          {[
                            { name: 'src', commit: 'refactor: optimize database queries', time: '2 days ago', type: 'folder' },
                            { name: 'public', commit: 'chore: add new favicon assets', time: '1 week ago', type: 'folder' },
                            { name: 'tests', commit: 'test: add integration tests for login', time: '3 hours ago', type: 'folder' },
                            { name: '.gitignore', commit: 'chore: ignore dist folder', time: '2 months ago', type: 'file' },
                            { name: 'package.json', commit: 'feat: update dependency versions', time: '3 hours ago', type: 'file' },
                            { name: 'README.md', commit: 'docs: update installation instructions', time: '5 days ago', type: 'file' }
                          ].map(file => (
                            <tr key={file.name} className={`hover:bg-white/[0.02] cursor-pointer group transition-colors ${editingFile === file.name ? 'bg-primary/5' : ''}`}>
                                <td className="px-4 py-3 flex items-center justify-between" onClick={() => file.type === 'file' ? startQuickEdit(file.name) : null}>
                                  <div className="flex items-center gap-3">
                                      <span className={`material-symbols-outlined !text-[20px] ${file.type === 'folder' ? 'text-blue-400' : 'text-slate-500'}`}>
                                        {file.type === 'folder' ? 'folder' : 'description'}
                                      </span>
                                      <span className="text-[13px] text-slate-200 group-hover:text-primary transition-colors">{file.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-[13px] text-slate-500 truncate max-w-[240px] font-medium">{file.commit}</td>
                                <td className="px-4 py-3 text-[13px] text-slate-500 text-right">{file.time}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                  </div>
                </>
              )}

              {activeTab === 'Pull Requests' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                   <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[16px] font-bold text-white">Pull Requests</h3>
                        <div className="flex items-center bg-surface-dark border border-border-dark p-0.5 rounded-lg">
                           <button className="px-2.5 py-1 text-[10px] font-bold text-primary bg-primary/10 rounded">Open</button>
                           <button className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-white">Merged</button>
                           <button className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-white">Closed</button>
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/20">New Pull Request</button>
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                      <div className="divide-y divide-[#30363d]">
                        {MOCK_PULL_REQUESTS.map(pr => (
                          <div key={pr.id} className="p-5 hover:bg-white/[0.02] transition-all group flex items-start gap-4">
                             <div className="mt-1">
                                <span className={`material-symbols-outlined !text-[20px] ${pr.status === 'Open' ? 'text-emerald-500' : pr.status === 'Merged' ? 'text-purple-400' : 'text-rose-400'}`}>
                                   {pr.status === 'Open' ? 'fork_right' : pr.status === 'Merged' ? 'merge' : 'block'}
                                </span>
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                   <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{pr.title}</h4>
                                   <div className="flex gap-1.5 shrink-0">
                                      {pr.labels.map(l => (
                                         <span key={l} className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-border-dark">
                                            {l}
                                         </span>
                                      ))}
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                   <span className="font-mono">{pr.id}</span>
                                   <span>•</span>
                                   <span className="flex items-center gap-1">
                                      <img src={pr.avatar} className="size-4 rounded-full" alt="" />
                                      {pr.author}
                                   </span>
                                   <span>•</span>
                                   <span>{pr.date}</span>
                                   <span>•</span>
                                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border-dark bg-background-dark/30">
                                      <span className={`material-symbols-outlined !text-[14px] ${pr.ci === 'Passing' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                         {pr.ci === 'Passing' ? 'check_circle' : 'cancel'}
                                      </span>
                                      <span className="text-[10px] font-bold uppercase tracking-tight">CI {pr.ci}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 text-slate-500">
                                <div className="flex items-center gap-1 text-[11px]">
                                   <span className="material-symbols-outlined !text-[16px]">chat_bubble</span>
                                   {Math.floor(Math.random() * 5)}
                                </div>
                                <span className="material-symbols-outlined text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'GitHub Actions' && (
                selectedRunId ? (
                  <WorkflowRunDetail run={selectedRun} onBack={() => setSelectedRunId(null)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 animate-in fade-in duration-300">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Workflows</h3>
                        <div className="space-y-1">
                          {['All workflows', 'CI Pipeline', 'Security Scan', 'Deployment to Staging', 'Lint & Test', 'Nightly Build'].map((wf, idx) => (
                            <div 
                              key={wf} 
                              className={`px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${idx === 0 ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                            >
                              {wf}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="text-[16px] font-bold text-white">All workflow runs</h3>
                      </div>
                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                        <div className="divide-y divide-[#30363d]">
                          {MOCK_WORKFLOW_RUNS.map((run) => (
                            <div 
                              key={run.id} 
                              onClick={() => setSelectedRunId(run.id)}
                              className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                            >
                              <div className="shrink-0">
                                {getWorkflowStatusIcon(run.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[14px] font-bold text-[#58a6ff] hover:underline truncate">
                                    {run.name} <span className="text-slate-500 font-normal">{run.runNumber}</span>
                                  </span>
                                  {run.status === 'Running' && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Active</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[14px]">account_tree</span>
                                    {run.branch}
                                  </span>
                                  <span>•</span>
                                  <span>{run.time}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[11px] text-slate-300 font-bold">{run.time}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{run.duration}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {['Issues', 'Insights', 'Settings'].includes(activeTab) && (
                <div className="p-20 text-center bg-[#161b22] border border-dashed border-[#30363d] rounded-xl">
                  <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">construction</span>
                  <h3 className="text-lg font-bold text-slate-400">{activeTab} section coming soon</h3>
                  <p className="text-sm text-slate-500 mt-2">We're hard at work building the next-generation developer experience.</p>
                </div>
              )}
           </div>

           <div className="space-y-8 min-w-0">
              <div className="p-1">
                 <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-4">About</h3>
                 <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
                    Core API service for the TrackCodex platform, integrating with Gitea for repository management and development workflows.
                 </p>
                 <div className="flex items-center gap-2 text-[#58a6ff] hover:underline cursor-pointer text-[13px] mb-4 group">
                    <span className="material-symbols-outlined !text-[16px] group-hover:scale-110 transition-transform">link</span>
                    <span>trackcodex.com/docs/api</span>
                 </div>
              </div>

              <div className="pt-6 border-t border-[#30363d]">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest">ForgeAI Refactors</h3>
                    <span className="bg-[#2d333b] px-2 py-0.5 rounded-full text-[10px] text-slate-400 font-black">3</span>
                 </div>
                 <div className="space-y-3">
                    <div className="p-3 rounded-xl border border-orange-500/20 bg-orange-500/5 group cursor-pointer hover:bg-orange-500/10 transition-all">
                       <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase mb-1.5">
                          <span className="material-symbols-outlined !text-[16px]">warning</span>
                          Complexity Alert
                       </div>
                       <p className="text-[12px] text-slate-300 leading-snug">The `processData` function in `utils.ts` has a cyclomatic complexity of 24.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RepoDetailView;
