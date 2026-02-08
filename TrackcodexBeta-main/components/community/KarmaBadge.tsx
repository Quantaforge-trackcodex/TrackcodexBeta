
import React from 'react';
import { KarmaLevel } from '../../types';

export const getKarmaLevel = (karma: number): KarmaLevel => {
  if (karma >= 1000) return 'Maintainer';
  if (karma >= 500) return 'Expert';
  if (karma >= 100) return 'Collaborator';
  return 'Contributor';
};

const KarmaBadge = ({ karma }: { karma: number }) => {
  const level = getKarmaLevel(karma);
  
  const styles = {
    Contributor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    Collaborator: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Expert: 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(19,91,236,0.3)]',
    Maintainer: 'bg-amber-500/10 text-amber-500 border-amber-500/20 ring-1 ring-amber-500/50'
  };

  return (
    <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.1em] border flex items-center gap-1.5 shrink-0 transition-all hover:scale-105 ${styles[level]}`}>
      <span className="material-symbols-outlined !text-[14px] filled">
        {level === 'Maintainer' ? 'military_tech' : level === 'Expert' ? 'psychology' : 'person'}
      </span>
      {level}
    </div>
  );
};

export default KarmaBadge;
