import React, { useState } from "react";
import { api, useAuth } from "../../context/AuthContext";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth(); // Assuming logout method exists in context
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isOAuthUser = !user?.role; // Rough check, improved by checking if user has password set in future
  // For now, we'll ask for password if they have one, or just typed confirmation

  // Ideally user object from context should know if password is set.
  // Let's assume for this implementation we always ask for typed confirmation,
  // and password only if it's a password-user.

  if (!isOpen) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await api.delete("/auth/account", {
        data: {
          password,
          confirmation,
        },
      });

      // Success
      logout();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete account");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gh-bg-secondary border border-red-500/30 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <span className="material-symbols-outlined text-3xl">warning</span>
            <h2 className="text-xl font-bold">Delete Account</h2>
          </div>

          <p className="text-gh-text mb-4 text-sm leading-relaxed">
            This action is{" "}
            <span className="font-bold text-red-400">permanent</span>. Your
            account, profile, and all associated data will be flagged for
            deletion and permanently removed after 30 days.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleDelete} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gh-text-secondary uppercase mb-1">
                Type "DELETE" to confirm
              </label>
              <input
                type="text"
                aria-label="Type DELETE to confirm"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:ring-2 focus:ring-red-500/50 outline-none"
                required
                pattern="DELETE"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gh-text-secondary uppercase mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:ring-2 focus:ring-red-500/50 outline-none"
                placeholder="Enter your password"
                // Optional if OAuth only, but good practice to have the field logic handled by backend
              />
              <p className="text-xs text-gh-text-secondary mt-1">
                Leave empty if you signed in with Google/GitHub and never set a
                password.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gh-bg-tertiary hover:bg-gh-border text-gh-text rounded-md font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || confirmation !== "DELETE"}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
              >
                {isLoading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
