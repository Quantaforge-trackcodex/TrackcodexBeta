
import React from 'react';
import HomeHero from '../components/home/HomeHero';
import ContinueWorkspaces from '../components/home/ContinueWorkspaces';
import NeedsAttention from '../components/home/NeedsAttention';
import JobHub from '../components/home/JobHub';
import LearnGrow from '../components/home/LearnGrow';

const HomeView = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-8 font-display">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Home</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enterprise Instance:</span>
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-black uppercase border border-primary/20">Active</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <HomeHero />
        </div>

        {/* Continue Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Continue where you left</h2>
            <button className="text-primary text-sm font-bold hover:underline">View all workspaces</button>
          </div>
          <ContinueWorkspaces />
        </section>

        {/* Grid for Attention and Job Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
           <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-rose-500 filled">report</span>
                <h2 className="text-xl font-bold text-white tracking-tight">Needs Attention</h2>
              </div>
              <NeedsAttention />
           </div>
           <div className="lg:col-span-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary filled">work</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">Job Hub</h2>
                </div>
                <button className="text-primary text-sm font-bold hover:underline">Go to Jobs</button>
              </div>
              <JobHub />
           </div>
        </div>

        {/* Footer Tiles */}
        <section className="pb-10">
          <h2 className="text-xl font-bold text-white tracking-tight mb-6">Learn, Share, Grow</h2>
          <LearnGrow />
        </section>
      </div>
    </div>
  );
};

export default HomeView;
