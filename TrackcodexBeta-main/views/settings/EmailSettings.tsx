import React, { useState } from "react";
import { otpService } from "../../services/otp";

const EmailSettings = () => {
  const [emails, setEmails] = useState([
    {
      address: "quantaforge25@gmail.com",
      primary: true,
      verified: true,
      linked: "Google",
    },
    {
      address: "alex@trackcodex.io",
      primary: false,
      verified: true,
      linked: null,
    },
  ]);

  // Input State
  const [newEmail, setNewEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Flow State
  const [verificationStep, setVerificationStep] = useState<
    "idle" | "verifying"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [keepPrivate, setKeepPrivate] = useState(false);

  // Step 1: Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      await otpService.sendOTP(newEmail);
      setVerificationStep("verifying");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Add Email
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      await otpService.verifyOTP(newEmail, otpInput);

      // Success! Add email
      setEmails([
        ...emails,
        {
          address: newEmail,
          primary: false,
          verified: true, // Auto-verified via OTP
          linked: null,
        },
      ]);

      // Reset State
      setVerificationStep("idle");
      setNewEmail("");
      setOtpInput("");

      // Success Feedback
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "Email Verified",
            message: `${newEmail} has been added to your account.`,
            type: "success",
          },
        }),
      );
    } catch (err: any) {
      setError(err.message || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelVerification = () => {
    setVerificationStep("idle");
    setOtpInput("");
    setError(null);
  };

  return (
    <div className="space-y-10">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Emails
        </h1>
        <p className="text-sm text-gh-text-secondary mt-1">
          Emails you can use to sign in to your account. Verified emails can be
          used as the author or committer addresses for web-based Git
          operations, e.g. edits and merges.
        </p>
      </header>

      <div className="space-y-4">
        {emails.map((email) => (
          <div
            key={email.address}
            className="p-5 bg-gh-bg-secondary border border-gh-border rounded-xl flex flex-col gap-3 group relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">
                  {email.address}
                </span>
                {email.primary && (
                  <span className="px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    Primary
                  </span>
                )}
                {email.verified && (
                  <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    Verified
                  </span>
                )}
                {email.linked && (
                  <span className="px-2 py-0.5 rounded-full border border-gh-border bg-gh-bg text-gh-text-secondary text-[10px] font-black uppercase tracking-widest">
                    Connected to {email.linked}
                  </span>
                )}
              </div>
              {!email.primary && (
                <button
                  aria-label="More options"
                  className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              )}
            </div>
            {email.primary && (
              <p className="text-[11px] text-gh-text-secondary">
                This email address is the default for TrackCodex notifications,
                such as replies to issues, pull requests, and similar activity.
              </p>
            )}
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-white">Add email address *</h3>

        {verificationStep === "idle" ? (
          /* INITIAL ADD FORM */
          <form onSubmit={handleSendOTP} className="flex gap-2 relative">
            <input
              aria-label="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email address"
              disabled={isLoading}
              className="bg-gh-bg border border-gh-border rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none flex-1 max-w-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!newEmail || isLoading}
              className="px-6 py-2 bg-gh-bg-tertiary border border-gh-border text-gh-text hover:bg-gh-bg-secondary rounded-lg text-sm font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? "Sending..." : "Add"}
            </button>
          </form>
        ) : (
          /* OTP VERIFICATION FORM */
          <div className="p-6 bg-gh-bg-secondary border border-primary/50 ring-1 ring-primary/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="max-w-md space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">
                    lock
                  </span>
                  Verify ownership
                </h4>
                <p className="text-xs text-gh-text-secondary mt-1">
                  We sent a verification code to{" "}
                  <span className="text-white font-medium">{newEmail}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="flex gap-2">
                <input
                  autoFocus
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="bg-gh-bg border border-gh-border rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none w-40 tracking-widest font-mono text-center"
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={!otpInput || isLoading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={cancelVerification}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </form>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold animate-in fade-in">
                  <span className="material-symbols-outlined !text-[16px]">
                    error
                  </span>
                  {error}
                </div>
              )}

              <div className="pt-2 border-t border-gh-border">
                <p className="text-[10px] text-slate-500">
                  Check the browser console / alert for the mock code.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">
              Primary email address
            </p>
            <p className="text-xs text-gh-text-secondary mt-1">
              Select an email to be used for account-related notifications and
              can be used for password reset.
            </p>
          </div>
          <div className="relative">
            <select
              aria-label="Primary email address"
              className="bg-gh-bg border border-gh-border rounded-lg pl-3 pr-8 py-2 text-sm text-gh-text outline-none appearance-none"
            >
              <option>quantaforge25@gmail.com</option>
              {emails
                .filter((e) => e.verified && !e.primary)
                .map((e) => (
                  <option key={e.address}>{e.address}</option>
                ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              unfold_more
            </span>
          </div>
        </div>

        <div className="h-px bg-gh-border" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-white">Backup email address</p>
            <p className="text-xs text-gh-text-secondary mt-1">
              Your backup GitHub email address will be used as an additional
              destination for security-relevant account notifications.
            </p>
          </div>
          <div className="relative">
            <select
              aria-label="Backup email address"
              className="bg-gh-bg border border-gh-border rounded-lg pl-3 pr-8 py-2 text-sm text-gh-text outline-none appearance-none"
            >
              <option>Allow all verified emails</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              unfold_more
            </span>
          </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl flex items-center justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-white">
            Keep my email addresses private
          </p>
          <p className="text-xs text-gh-text-secondary mt-1 leading-relaxed">
            We’ll remove your public profile email and use{" "}
            <span className="font-mono text-primary">
              250711000+Quantaforze-trackcodex@users.noreply.trackcodex.io
            </span>{" "}
            when performing web-based Git operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {keepPrivate ? "On" : "Off"}
          </span>
          <button
            aria-label="Toggle email privacy"
            onClick={() => setKeepPrivate(!keepPrivate)}
            className={`w-10 h-5 rounded-full relative transition-all ${keepPrivate ? "bg-primary" : "bg-slate-800"}`}
          >
            <div
              className={`absolute top-1 size-3 rounded-full transition-all ${keepPrivate ? "left-6 bg-primary-foreground" : "left-1 bg-primary-foreground"}`}
            />
          </button>
        </div>
      </section>
    </div>
  );
};

export default EmailSettings;
