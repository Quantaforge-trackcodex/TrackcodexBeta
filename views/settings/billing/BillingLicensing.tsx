import React from 'react';

const BillingLicensing = () => {
  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">Licensing</h1>
        <p className="text-gh-text-secondary">Manage your licenses and seat allocations.</p>
      </header>
      <section>
        <div className="flex flex-col items-center py-16 px-6 text-center border border-dashed border-gh-border rounded-2xl bg-gh-bg/30">
          <div className="size-16 rounded-full bg-gh-bg-secondary border border-gh-border flex items-center justify-center text-slate-600 mb-6">
            <span className="material-symbols-outlined !text-[32px]">license</span>
          </div>
          <h4 className="text-xl font-bold text-gh-text mb-3">License management coming soon</h4>
        </div>
      </section>
    </div>
  );
};

export default BillingLicensing;
