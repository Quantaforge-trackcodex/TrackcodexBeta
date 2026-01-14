
import { useState, useCallback } from 'react';
import { forgeAIService } from '../services/gemini';
import { api } from '../services/api';

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
      // Internal backend call for metering and context enhancement
      await api.forgeAI.streamCompletion(context.code, { file: context.fileName });
      
      // Client-side Gemini fallback/direct call for speed
      const prefix = context.code.split('\n').slice(0, context.cursorLine).join('\n');
      const suffix = context.code.split('\n').slice(context.cursorLine).join('\n');
      
      return await forgeAIService.getAICompletion(prefix, suffix, context.fileName);
    } catch (e: any) {
      setError(e.message || 'AI generation failed');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const requestReview = useCallback(async (code: string, fileName: string) => {
    setIsProcessing(true);
    try {
      return await forgeAIService.getCodeReview(code, fileName);
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { getCompletion, requestReview, isProcessing, error };
};
