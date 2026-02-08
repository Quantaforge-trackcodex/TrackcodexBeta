import React, { useState } from "react";
import { useAuth, api } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmText !== user?.username) return;

    setIsDeleting(true);
    try {
      // Real API call
      await api.delete("/users/me");

      // Perform logout and redirect
      await logout();
      navigate("/");
      window.location.reload(); // Force reload to clear any state
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-[#f85149]">Delete Account</h2>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-[#c9d1d9]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-[#f85149]/10 border border-[#f85149]/40 rounded-md p-3 mb-4">
            <p className="text-[#f85149] text-sm font-semibold">
              Warning: This action is irreversible.
            </p>
          </div>
          <p className="text-[#c9d1d9] text-sm mb-4">
            This will permanently delete your account{" "}
            <strong>{user?.username}</strong>, including all repositories,
            organizations, and personal data.
          </p>
          <p className="text-[#c9d1d9] text-sm mb-2">
            Please type <strong>{user?.username}</strong> to confirm.
          </p>
          <label htmlFor="confirm-username" className="sr-only">
            Confirm username
          </label>
          <input
            id="confirm-username"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#c9d1d9] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none"
            aria-label="Type your username to confirm account deletion"
            placeholder={user?.username}
          />
        </div>

        <button
          onClick={handleDelete}
          disabled={confirmText !== user?.username || isDeleting}
          className={`w-full py-2 px-4 rounded-md font-bold text-white transition-all ${
            confirmText === user?.username && !isDeleting
              ? "bg-[#da3633] hover:bg-[#b62324]"
              : "bg-[#21262d] text-[#8b949e] cursor-not-allowed"
          }`}
        >
          {isDeleting ? "Deleting account..." : "Delete this account"}
        </button>
      </div>
    </div>
  );
};
