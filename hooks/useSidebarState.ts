
import { useState, useEffect, useCallback } from 'react';

const SIDEBAR_STORAGE_KEY = 'trackcodex_sidebar_expanded';

export const useSidebarState = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return { isExpanded, toggleSidebar };
};
