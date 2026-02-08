import React, { useState } from "react";
import { workspaceCollaborationService } from "../../services/workspaceCollaborationService";
import "../../styles/WorkspacePasswordModal.css";

interface WorkspacePasswordModalProps {
  workspaceId: string;
  workspaceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WorkspacePasswordModal: React.FC<WorkspacePasswordModalProps> = ({
  workspaceId,
  workspaceName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { valid } =
        await workspaceCollaborationService.verifyWorkspacePassword(
          workspaceId,
          password,
        );

      if (valid) {
        onSuccess();
        onClose();
      } else {
        setError("Incorrect password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="password-modal-header">
          <span className="material-symbols-outlined lock-icon">lock</span>
          <h2>Password Required</h2>
        </div>

        <div className="password-modal-content">
          <p className="password-description">
            "{workspaceName}" is password protected. Enter the password to
            access this workspace.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="password-input-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter workspace password"
                autoFocus
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="password-modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !password}
              >
                {loading ? "Verifying..." : "Access Workspace"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
