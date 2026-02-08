import React, { useState, useEffect } from "react";
import {
  workspaceCollaborationService,
  WorkspaceMember,
} from "../../services/workspaceCollaborationService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/WorkspaceMembersModal.css";

interface WorkspaceMembersModalProps {
  workspaceId: string;
  workspaceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceMembersModal: React.FC<WorkspaceMembersModalProps> = ({
  workspaceId,
  workspaceName,
  isOpen,
  onClose,
}) => {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const loadMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const { members: memberList } =
        await workspaceCollaborationService.getWorkspaceMembers(workspaceId);
      setMembers(memberList);

      // Find current user's role
      const currentMember = memberList.find(
        (m) => m.userId === currentUser?.id,
      );
      setCurrentUserRole(currentMember?.role || null);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, currentUser?.id]);

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, loadMembers]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setActionLoading((prev) => ({ ...prev, [memberId]: true }));
    try {
      await workspaceCollaborationService.updateMemberRole(
        workspaceId,
        memberId,
        newRole,
      );
      loadMembers();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    setActionLoading((prev) => ({ ...prev, [memberId]: true }));
    try {
      await workspaceCollaborationService.removeMember(workspaceId, memberId);
      loadMembers();
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleLeaveWorkspace = async () => {
    if (!confirm("Are you sure you want to leave this workspace?")) return;

    try {
      await workspaceCollaborationService.leaveWorkspace(workspaceId);
      onClose();
      window.location.href = "/workspaces";
    } catch (error) {
      alert((error as Error).message || "Failed to leave workspace");
    }
  };

  const canManageMembers =
    currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const isOwner = currentUserRole === "OWNER";

  if (!isOpen) return null;

  return (
    <div className="members-modal-overlay" onClick={onClose}>
      <div className="members-modal" onClick={(e) => e.stopPropagation()}>
        <div className="members-modal-header">
          <h2>Members of "{workspaceName}"</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="members-modal-content">
          {loading ? (
            <div className="loading-state">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="empty-state">No members found</div>
          ) : (
            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    {member.user.avatar ? (
                      <img src={member.user.avatar} alt={member.user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="member-info">
                    <div className="member-name">{member.user.name}</div>
                    <div className="member-username">
                      @{member.user.username}
                    </div>
                    {member.inviter && (
                      <div className="member-invited">
                        Invited by @{member.inviter.username}
                      </div>
                    )}
                  </div>

                  <div className="member-actions">
                    {member.role === "OWNER" ? (
                      <span className="role-badge owner">Owner</span>
                    ) : canManageMembers &&
                      member.userId !== currentUser?.id ? (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(member.userId, e.target.value)
                          }
                          disabled={actionLoading[member.userId]}
                          className="role-select"
                          aria-label="Change member role"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="WRITE">Write</option>
                          <option value="READ">Read</option>
                        </select>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={actionLoading[member.userId]}
                        >
                          <span className="material-symbols-outlined">
                            person_remove
                          </span>
                        </button>
                      </>
                    ) : (
                      <span className="role-badge">{member.role}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leave Workspace Button */}
          {!isOwner && currentUser && (
            <div className="modal-footer">
              <button
                className="leave-workspace-btn"
                onClick={handleLeaveWorkspace}
              >
                Leave Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
