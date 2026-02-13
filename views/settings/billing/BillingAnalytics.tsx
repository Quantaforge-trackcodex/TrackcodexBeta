import React from 'react';

const BillingAnalytics = () => {
  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
          Premium request analytics
        </h1>
        <p className="text-gh-text-secondary">
          View analytics for premium API requests and usage patterns.
        </p>
      </header>
      <section>
        <div className="flex flex-col items-center py-16 px-6 text-center border border-dashed border-gh-border rounded-2xl bg-gh-bg/30">
          <div className="size-16 rounded-full bg-gh-bg-secondary border border-gh-border flex items-center justify-center text-slate-600 mb-6">
            <span className="material-symbols-outlined !text-[32px]">insights</span>
          </div>
          <h4 className="text-xl font-bold text-gh-text mb-3">Analytics coming soon</h4>
          <p className="text-sm text-gh-text-secondary max-w-lg leading-relaxed">
            Premium request analytics will be available here.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BillingAnalytics;
