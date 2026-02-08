import React, { useState, useEffect, RefObject } from 'react';

interface ScrollControlsProps {
  containerRef: RefObject<HTMLDivElement>;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({ containerRef }) => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isNearTop = el.scrollTop < 200;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
      
      setShowTop(!isNearTop);
      setShowBottom(!isNearBottom);
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => el.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollTo = (position: 'top' | 'bottom') => {
    const el = containerRef.current;
    if (!el) return;
    
    el.scrollTo({
      top: position === 'top' ? 0 : el.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-10 right-10 z-[400] flex flex-col gap-3">
      {showTop && (
        <button
          onClick={() => scrollTo('top')}
          className="size-10 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-fab border-2 border-[#0d1117] ring-4 ring-primary/20"
          title="Scroll to top"
        >
          <span className="material-symbols-outlined !text-[24px] font-black">keyboard_double_arrow_up</span>
        </button>
      )}
      
      {showBottom && (
        <button
          onClick={() => scrollTo('bottom')}
          className="size-10 bg-[#161b22] text-slate-400 rounded-full shadow-2xl flex items-center justify-center hover:text-white hover:scale-110 active:scale-95 transition-all animate-fab border border-[#30363d] ring-4 ring-black/20"
          title="Scroll to bottom"
        >
          <span className="material-symbols-outlined !text-[24px]">keyboard_double_arrow_down</span>
        </button>
      )}
    </div>
  );
};

export default ScrollControls;
