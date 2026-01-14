import React, { useState } from 'react';

const EmailSettings = () => {
  const [emails, setEmails] = useState([
    { address: 'quantaforge25@gmail.com', primary: true, verified: true, linked: 'Google' },
    { address: 'alex@trackcodex.io', primary: false, verified: true, linked: null }
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [keepPrivate, setKeepPrivate] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setEmails([...emails, { address: newEmail, primary: false, verified: false, linked: null }]);
    setNewEmail('');
  };

  return (
    <div className="space-y-10">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Emails</h1>
        <p className="text-sm text-gh-text-secondary mt-1">
          Emails you can use to sign in to your account. Verified emails can be used as the author or committer addresses for web-based Git operations, e.g. edits and merges.
        </p>
      </header>

      <div className="space-y-4">
        {emails.map((email) => (
          <div key={email.address} className="p-5 bg-gh-bg-secondary border border-gh-border rounded-xl flex flex-col gap-3 group relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{email.address}</span>
                {email.primary && <span className="px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Primary</span>}
                {email.verified && <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Verified</span>}
                {email.linked && <span className="px-2 py-0.5 rounded-full border border-[#30363d] bg-gh-bg text-gh-text-secondary text-[10px] font-black uppercase tracking-widest">Connected to {email.linked}</span>}
              </div>
              {!email.primary && (
                <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              )}
            </div>
            {email.primary && (
              <p className="text-[11px] text-gh-text-secondary">This email address is the default for TrackCodex notifications, such as replies to issues, pull requests, and similar activity.</p>
            )}
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-white">Add email address *</h3>
        <form onSubmit={handleAdd} className="flex gap-2">
           <input 
             value={newEmail}
             onChange={(e) => setNewEmail(e.target.value)}
             placeholder="Email address"
             className="bg-gh-bg border border-gh-border rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none flex-1 max-w-sm"
           />
           <button type="submit" className="px-6 py-2 bg-[#21262d] border border-gh-border text-gh-text hover:bg-[#30363d] rounded-lg text-sm font-bold transition-all shadow-sm">
             Add
           </button>
        </form>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl space-y-6">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-sm font-bold text-white">Primary email address</p>
              <p className="text-xs text-gh-text-secondary mt-1">Select an email to be used for account-related notifications and can be used for password reset.</p>
           </div>
           <div className="relative">
              <select className="bg-gh-bg border border-gh-border rounded-lg pl-3 pr-8 py-2 text-sm text-gh-text outline-none appearance-none">
                 <option>quantaforge25@gmail.com</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">unfold_more</span>
           </div>
        </div>

        <div className="h-px bg-gh-border" />

        <div className="flex items-center justify-between">
           <div>
              <p className="text-sm font-bold text-white">Backup email address</p>
              <p className="text-xs text-gh-text-secondary mt-1">Your backup GitHub email address will be used as an additional destination for security-relevant account notifications.</p>
           </div>
           <div className="relative">
              <select className="bg-gh-bg border border-gh-border rounded-lg pl-3 pr-8 py-2 text-sm text-gh-text outline-none appearance-none">
                 <option>Allow all verified emails</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">unfold_more</span>
           </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl flex items-center justify-between">
         <div className="max-w-2xl">
            <p className="text-sm font-bold text-white">Keep my email addresses private</p>
            <p className="text-xs text-gh-text-secondary mt-1 leading-relaxed">
              We’ll remove your public profile email and use <span className="font-mono text-primary">250711000+Quantaforge-trackcodex@users.noreply.trackcodex.io</span> when performing web-based Git operations.
            </p>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{keepPrivate ? 'On' : 'Off'}</span>
            <button 
              onClick={() => setKeepPrivate(!keepPrivate)}
              className={`w-10 h-5 rounded-full relative transition-all ${keepPrivate ? 'bg-primary' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 size-3 bg-white rounded-full transition-all ${keepPrivate ? 'left-6' : 'left-1'}`} />
            </button>
         </div>
      </section>
    </div>
  );
};

export default EmailSettings;