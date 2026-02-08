import React, { useState, useEffect } from "react";
import {
  workspaceCollaborationService,
  WorkspaceInvite,
} from "../../services/workspaceCollaborationService";
import { useNavigate } from "react-router-dom";
import "../../styles/WorkspaceInvites.css";

export const WorkspaceInvites: React.FC = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    setLoading(true);
    try {
      const { invites: inviteList } =
        await workspaceCollaborationService.getPendingInvites();
      setInvites(inviteList);
    } catch (error) {
      console.error("Error loading invites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (token: string, workspaceId: string) => {
    setActionLoading((prev) => ({ ...prev, [token]: true }));
    try {
      await workspaceCollaborationService.acceptInvite(token);
      setInvites((prev) => prev.filter((inv) => inv.token !== token));
      // Navigate to workspace
      navigate(`/workspace/${workspaceId}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to accept invite");
    } finally {
      setActionLoading((prev) => ({ ...prev, [token]: false }));
    }
  };

  const handleDecline = async (token: string) => {
    if (!confirm("Are you sure you want to decline this invite?")) return;

    setActionLoading((prev) => ({ ...prev, [token]: true }));
    try {
      await workspaceCollaborationService.declineInvite(token);
      setInvites((prev) => prev.filter((inv) => inv.token !== token));
    } catch (error) {
      console.error("Error declining invite:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [token]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    return `Expires in ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="workspace-invites">
        <div className="invites-header">
          <h2>Workspace Invitations</h2>
        </div>
        <div className="loading-state">Loading invitations...</div>
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="workspace-invites">
        <div className="invites-header">
          <h2>Workspace Invitations</h2>
        </div>
        <div className="empty-state">
          <span className="material-symbols-outlined">mail_outline</span>
          <p>No pending invitations</p>
          <span className="empty-hint">
            You'll see workspace invitations here when someone invites you to
            collaborate
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-invites">
      <div className="invites-header">
        <h2>Workspace Invitations</h2>
        <span className="invite-count">{invites.length}</span>
      </div>

      <div className="invites-list">
        {invites.map((invite) => (
          <div key={invite.id} className="invite-card">
            <div className="invite-card-header">
              <div className="workspace-icon">
                <span className="material-symbols-outlined">folder</span>
              </div>
              <div className="invite-meta">
                <h3 className="workspace-name">{invite.workspace.name}</h3>
                {invite.workspace.description && (
                  <p className="workspace-description">
                    {invite.workspace.description}
                  </p>
                )}
              </div>
            </div>

            <div className="invite-details">
              <div className="invite-detail-item">
                <span className="material-symbols-outlined">person</span>
                <span>
                  Invited by <strong>@{invite.inviter.username}</strong>
                </span>
              </div>
              <div className="invite-detail-item">
                <span className="material-symbols-outlined">badge</span>
                <span>
                  Role: <strong>{invite.role}</strong>
                </span>
              </div>
              <div className="invite-detail-item">
                <span className="material-symbols-outlined">schedule</span>
                <span
                  className={
                    new Date(invite.expiresAt) < new Date() ? "expired" : ""
                  }
                >
                  {formatDate(invite.expiresAt)}
                </span>
              </div>
            </div>

            <div className="invite-actions">
              <button
                className="decline-btn"
                onClick={() => handleDecline(invite.token)}
                disabled={actionLoading[invite.token]}
              >
                Decline
              </button>
              <button
                className="accept-btn"
                onClick={() => handleAccept(invite.token, invite.workspace.id)}
                disabled={actionLoading[invite.token]}
              >
                {actionLoading[invite.token] ? "Accepting..." : "Accept"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
