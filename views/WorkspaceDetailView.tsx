import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_WORKSPACES } from '../constants';
import { Workspace } from '../types';
import Spinner from '../components/ui/Spinner';

const WorkspaceDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      const found = MOCK_WORKSPACES.find(ws => ws.id === id);
      setWorkspace(found);
      setIsLoading(false);
    }, 500);
  }, [id]);


  if (isLoading || !workspace) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gh-bg font-display text-center">
      <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-12 max-w-2xl animate-in fade-in duration-500">
        <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
          <span className="material-symbols-outlined !text-4xl">terminal</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Workspace: {workspace.name}
        </h1>
        <p className="text-gh-text-secondary mt-2">
          Cloud development environment for <span className="font-mono text-primary">{workspace.repo}</span> on branch <span className="font-mono text-primary">{workspace.branch}</span>.
        </p>
        
        <div className="mt-8 pt-8 border-t border-gh-border">
          <button 
            onClick={() => navigate('/editor')}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
          >
            Open in Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailView;