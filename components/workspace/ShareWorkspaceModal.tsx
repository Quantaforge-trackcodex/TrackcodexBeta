import React, { useState, useEffect } from "react";
import {
  workspaceCollaborationService,
  WorkspaceInvite,
} from "../../services/workspaceCollaborationService";
import "../../styles/ShareWorkspaceModal.css";

interface ShareWorkspaceModalProps {
  workspaceId: string;
  workspaceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWorkspaceModal: React.FC<ShareWorkspaceModalProps> = ({
  workspaceId,
  workspaceName,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("WRITE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingInvites, setPendingInvites] = useState<WorkspaceInvite[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadPendingInvites();
    }
  }, [isOpen, workspaceId]);

  const loadPendingInvites = async () => {
    try {
      // Note: This would need a workspace-specific endpoint
      // For now, we'll skip loading pending invites
      setPendingInvites([]);
    } catch (err) {
      console.error("Error loading invites:", err);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await workspaceCollaborationService.inviteToWorkspace(
        workspaceId,
        email,
        role,
      );
      setSuccess(`Invite sent to ${email}`);
      setEmail("");
      loadPendingInvites();
    } catch (err) {
      setError((err as Error).message || "Failed to send invite");
      console.error("Invite error details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await workspaceCollaborationService.cancelInvite(workspaceId, inviteId);
      loadPendingInvites();
    } catch (err) {
      console.error("Error cancelling invite:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>Share "{workspaceName}"</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="share-modal-content">
          {/* Invite Form */}
          <form onSubmit={handleInvite} className="invite-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="READ">Read - Can view workspace</option>
                <option value="WRITE">Write - Can edit workspace</option>
                <option value="ADMIN">Admin - Can manage members</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="invite-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </form>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div className="pending-invites">
              <h3>Pending Invites</h3>
              <div className="invite-list">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="invite-item">
                    <div className="invite-info">
                      <span className="invite-email">{invite.email}</span>
                      <span className="invite-role">{invite.role}</span>
                    </div>
                    <button
                      className="cancel-invite-btn"
                      onClick={() => handleCancelInvite(invite.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Link Section */}
          <div className="share-link-section">
            <h3>Share Link</h3>
            <p className="share-link-description">
              Anyone with this link can request access to the workspace
            </p>
            <div className="share-link-input">
              <input
                type="text"
                value={`${window.location.origin}/workspace/${workspaceId}`}
                readOnly
                aria-label="Workspace invite link"
              />
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/workspace/${workspaceId}`,
                  );
                  setSuccess("Link copied to clipboard!");
                }}
              >
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
