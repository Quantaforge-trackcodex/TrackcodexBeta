import React, { useState } from "react";
import GlobalSearchModal from "../search/GlobalSearchModal";

/**
 * Wrapper component that provides global search functionality
 */
const GlobalSearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Listen for global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      // Forward slash (/) - only if not typing in input/textarea
      else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {children}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};

export default GlobalSearchProvider;
