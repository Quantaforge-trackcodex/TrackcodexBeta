import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { Workspace } from "../types";

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    // setLoading(true); // Removed to avoid sync state update in useEffect. Initial state is true.
    try {
      const data = await api.workspaces.list();
      setWorkspaces(data);
    } catch (err: unknown) {
      console.error("Failed to fetch workspaces", err);
      const message =
        err instanceof Error ? err.message : "Failed to load workspaces";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkspace = async (data: Partial<Workspace>) => {
    const newWs = await api.workspaces.create(data);
    setWorkspaces((prev) => [newWs, ...prev]);
    return newWs;
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return {
    workspaces,
    loading,
    error,
    refresh: () => {
      setLoading(true);
      return fetchWorkspaces();
    },
    createWorkspace,
  };
};
