
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Workspace } from '../types';

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.workspaces.list();
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkspace = async (data: any) => {
    const newWs = await api.workspaces.create(data);
    setWorkspaces(prev => [newWs, ...prev]);
    return newWs;
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return { workspaces, loading, error, refresh: fetchWorkspaces, createWorkspace };
};
