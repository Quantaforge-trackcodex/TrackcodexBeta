import React from 'react';

const SecurityMethod = ({ icon, title, desc, actionLabel, onAction }: any) => (
  <div className="p-5 border-b border-gh-border last:border-0 flex items-center justify-between hover:bg-white/[0.01] transition-all">
    <div className="flex items-center gap-5">
      <div className="size-10 rounded-lg bg-gh-bg flex items-center justify-center text-slate-500 border border-gh-border">
         {typeof icon === 'string' ? <span className="material-symbols-outlined">{icon}</span> : icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-gh-text-secondary mt-0.5">{desc}</p>
      </div>
    </div>
    {actionLabel && (
      <button 
        onClick={onAction}
        className="px-4 py-1.5 bg-[#21262d] border border-gh-border text-gh-text hover:bg-[#30363d] rounded-lg text-xs font-bold transition-all shadow-sm"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const SecuritySettings = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Password and authentication</h1>
      </header>

      <section>
        <h3 className="text-lg font-bold text-white mb-4">Sign in methods</h3>
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
          <SecurityMethod 
            icon="mail" 
            title="Email" 
            desc="1 verified email configured" 
            actionLabel="Manage" 
          />
          <SecurityMethod 
            icon="password" 
            title="Password" 
            desc="Configured" 
            actionLabel="Change password" 
          />
          <SecurityMethod 
            icon="person_pin" 
            title="Passkeys" 
            desc="Passwordless sign-in with biometrics or security keys" 
            actionLabel="Add passkey" 
          />
          <SecurityMethod 
            icon={<img src="https://www.google.com/favicon.ico" className="size-4 grayscale opacity-70" />} 
            title="Google" 
            desc="1 account connected" 
            actionLabel={<span className="material-symbols-outlined !text-sm">more_horiz</span>} 
          />
          <SecurityMethod 
            icon={<span className="material-symbols-outlined">brand_family</span>} 
            title="Apple" 
            desc="Sign in with your Apple account" 
            actionLabel="Connect" 
          />
        </div>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-white mb-6">Two-factor authentication</h3>
        <div className="flex flex-col items-center py-12 px-6 text-center border border-dashed border-gh-border rounded-2xl bg-gh-bg-secondary/30">
           <div className="size-16 rounded-full bg-gh-bg border border-gh-border flex items-center justify-center text-slate-600 mb-6">
              <span className="material-symbols-outlined !text-[32px]">lock</span>
           </div>
           <h4 className="text-xl font-bold text-white mb-3">Two-factor authentication is not enabled yet.</h4>
           <p className="text-sm text-gh-text-secondary max-w-lg mb-8 leading-relaxed">
             Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
           </p>
           <button className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-gh-bg rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
             Enable two-factor authentication
           </button>
        </div>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-bold text-white">Sessions</h3>
           <button className="text-xs font-bold text-primary hover:underline">Revoke all</button>
        </div>
        <div className="p-5 bg-gh-bg-secondary border border-gh-border rounded-xl flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-500 !text-3xl">laptop_mac</span>
              <div>
                <p className="text-sm font-bold text-white">Mac OS • Seattle, US</p>
                <p className="text-xs text-gh-text-secondary">Your current session • Chrome 124.0.0</p>
              </div>
           </div>
           <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
        </div>
      </section>
    </div>
  );
};

export default SecuritySettings;