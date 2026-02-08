import React, { useState } from "react";
import LinkedAccounts from "./LinkedAccounts";
import SessionManager from "./SessionManager";
import SecurityAuditLog from "./SecurityAuditLog";
import DeleteAccountModal from "./DeleteAccountModal";

const SecurityMethod = ({ icon, title, desc, actionLabel, onAction }: any) => (
  <div className="p-5 border-b border-gh-border last:border-0 flex items-center justify-between hover:bg-white/[0.01] transition-all">
    <div className="flex items-center gap-5">
      <div className="size-10 rounded-lg bg-gh-bg flex items-center justify-center text-slate-500 border border-gh-border">
        {typeof icon === "string" ? (
          <span className="material-symbols-outlined">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gh-text">{title}</h4>
        <p className="text-xs text-gh-text-secondary mt-0.5">{desc}</p>
      </div>
    </div>
    {actionLabel && (
      <button
        onClick={onAction}
        className="px-4 py-1.5 bg-gh-bg-secondary border border-gh-border text-gh-text hover:bg-gh-bg-tertiary rounded-lg text-xs font-bold transition-all shadow-sm"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const SecuritySettings = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
          Password and authentication
        </h1>
        <p className="text-gh-text-secondary">
          Manage how you sign in and secure your account.
        </p>
      </header>

      <section>
        <h3 className="text-lg font-bold text-gh-text mb-4">Sign in methods</h3>
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden mb-8">
          <SecurityMethod
            icon="mail"
            title="Email"
            desc="Primary email address"
            actionLabel="Manage"
          />
          <SecurityMethod
            icon="password"
            title="Password"
            desc="Last changed 3 months ago"
            actionLabel="Change password"
          />
          <SecurityMethod
            icon="person_pin"
            title="Passkeys"
            desc="Passwordless sign-in with biometrics or security keys"
            actionLabel="Add passkey"
          />
        </div>

        {/* Linked Accounts Component */}
        <LinkedAccounts />
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-gh-text mb-6">
          Two-factor authentication
        </h3>
        <div className="flex flex-col items-center py-12 px-6 text-center border border-dashed border-gh-border rounded-2xl bg-gh-bg/30">
          <div className="size-16 rounded-full bg-gh-bg-secondary border border-gh-border flex items-center justify-center text-slate-600 mb-6">
            <span className="material-symbols-outlined !text-[32px]">lock</span>
          </div>
          <h4 className="text-xl font-bold text-gh-text mb-3">
            Two-factor authentication is not enabled yet.
          </h4>
          <p className="text-sm text-gh-text-secondary max-w-lg mb-8 leading-relaxed">
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to sign in.
          </p>
          <button className="px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">
            Enable two-factor authentication
          </button>
        </div>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <SessionManager />
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-gh-text mb-6">Security Log</h3>
        <SecurityAuditLog />
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
        <div className="border border-red-500/20 rounded-lg p-6 bg-red-900/5">
          <h4 className="font-bold text-gh-text mb-2">Delete Account</h4>
          <p className="text-sm text-gh-text-secondary mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/50 rounded-md font-medium text-sm transition-colors"
          >
            Delete Account
          </button>
        </div>
      </section>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default SecuritySettings;
