import { useState, useCallback } from "react";
import { api } from "../services/api";

interface AIContext {
  fileName: string;
  code: string;
  cursorLine?: number;
  neighborFiles?: string[];
}

export const useForgeAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCompletion = useCallback(async (context: AIContext) => {
    setIsProcessing(true);
    setError(null);
    try {
      const workspaceId = localStorage.getItem("current_workspace_id");
      const result = await api.forgeAI.complete({
        prompt: `File: ${context.fileName}\nCode Context:\n${context.code}\n\nProvide completion at line ${context.cursorLine}`,
        workspaceId,
        systemPrompt:
          "You are a code completion engine. Respond ONLY with the code to be inserted.",
      });
      return result.content;
    } catch (e: any) {
      setError(e.message || "AI generation failed");
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const requestReview = useCallback(async (code: string, fileName: string) => {
    setIsProcessing(true);
    try {
      const workspaceId = localStorage.getItem("current_workspace_id");
      const result = await api.forgeAI.complete({
        prompt: `Review this code for ${fileName}:\n\n${code}`,
        workspaceId,
        systemPrompt:
          "You are a Senior Architect. Provide a thorough, critical code review.",
      });
      return result.content;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { getCompletion, requestReview, isProcessing, error };
};
