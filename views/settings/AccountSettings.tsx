import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteAccountModal } from "../../components/settings/DeleteAccountModal";

const AccountSettings = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleExport = async () => {
    setIsExporting(true);
    window.dispatchEvent(
      new CustomEvent("trackcodex-notification", {
        detail: {
          title: "Export Started",
          message:
            "Generating your data archive. It will start downloading shortly.",
          type: "info",
        },
      }),
    );

    try {
      const response = await fetch("/api/v1/users/me/export", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trackcodex-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      window.dispatchEvent(
        new CustomEvent("trackcodex-notification", {
          detail: {
            title: "Export Failed",
            message: "Failed to generate data archive. Please try again.",
            type: "error",
          },
        }),
      );
    } finally {
      setIsExporting(false);
    }
  };

  const openCookieSettings = () => {
    localStorage.removeItem("trackcodex_cookie_consent");
    window.location.reload();
  };

  return (
    <div className="space-y-12">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Account settings
        </h1>
      </header>

      <section>
        <p className="text-sm text-gh-text-secondary">
          Manage your account settings and preferences. For public profile
          information, including your username, please visit the{" "}
          <span
            onClick={() => navigate("/settings/profile")}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            Public Profile
          </span>{" "}
          page.
        </p>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-white mb-4">
          Link Patreon account
        </h3>
        <p className="text-sm text-gh-text-secondary mb-6 leading-relaxed">
          Connect a Patreon account for{" "}
          <span className="text-white font-bold">@Quantaforze-trackcodex</span>{" "}
          to sponsor maintainers with. Get recognition on TrackCodex for
          sponsorships made on Patreon when the sponsored person has linked
          Patreon and TrackCodex, too.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text hover:bg-gh-bg rounded-lg text-xs font-bold transition-all">
          <span className="material-symbols-outlined !text-[18px]">forum</span>
          Connect with Patreon
        </button>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-white mb-4">
          Export account data
        </h3>
        <p className="text-sm text-gh-text-secondary mb-6 leading-relaxed">
          Export all repositories and profile metadata for{" "}
          <span className="text-white font-bold">@Quantaforze-trackcodex</span>.
          Exports will be available for 7 days.
        </p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text hover:bg-gh-bg-tertiary rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          {isExporting ? (
            <span className="material-symbols-outlined animate-spin text-sm">
              progress_activity
            </span>
          ) : null}
          {isExporting ? "Preparing export..." : "Start export"}
        </button>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-white mb-4">Privacy & Cookies</h3>
        <p className="text-sm text-gh-text-secondary mb-6 leading-relaxed">
          Manage your cookie preferences and privacy settings. You can reset
          your cookie consent to view the banner again.
        </p>
        <button
          onClick={openCookieSettings}
          className="px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text hover:bg-gh-bg-tertiary rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          Reset Cookie Consent
        </button>
      </section>

      <section className="pt-10 border-t border-gh-border">
        <h3 className="text-lg font-bold text-white mb-4">
          Successor settings
        </h3>
        <p className="text-sm text-gh-text-secondary mb-8 leading-relaxed">
          By clicking "Add Successor" below, I acknowledge that I am the owner
          of the @Quantaforze-trackcodex account, and am authorizing TrackCodex
          to transfer content within that account to my TrackCodex Successor,
          designated below, in the event of my death. I understand that this
          appointment of a successor does not override legally binding
          next-of-kin rules or estate laws.{" "}
          <span className="text-primary hover:underline cursor-pointer">
            Learn more about account successors.
          </span>
        </p>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
            Search by username, full name, or email address
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative group max-w-xl">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-[18px] group-focus-within:text-primary transition-colors">
                person
              </span>
              <input
                className="w-full bg-gh-bg border border-gh-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Find user..."
              />
            </div>
            <button className="px-6 py-2 bg-gh-bg-secondary border border-gh-border text-slate-600 rounded-lg text-xs font-bold cursor-not-allowed">
              Add Successor
            </button>
          </div>
        </div>
      </section>

      <section className="pt-16 border-t border-rose-500/20">
        <h3 className="text-lg font-bold text-rose-500 mb-4">Danger Zone</h3>
        <div className="border border-rose-500/30 rounded-xl overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-gh-border last:border-0 hover:bg-rose-500/[0.02] transition-all">
            <div>
              <p className="text-sm font-bold text-white">Deactivate account</p>
              <p className="text-xs text-gh-text-secondary">
                Temporarily disable access to your account.
              </p>
            </div>
            <button className="px-4 py-2 bg-gh-bg border border-gh-border text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all">
              Deactivate
            </button>
          </div>
          <div className="p-5 flex items-center justify-between hover:bg-rose-500/[0.02] transition-all">
            <div>
              <p className="text-sm font-bold text-white">Delete account</p>
              <p className="text-xs text-gh-text-secondary">
                Permanently remove all data and repository access.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default AccountSettings;
