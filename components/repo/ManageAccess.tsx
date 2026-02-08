import React, { useState, useEffect } from "react";
import {
  repoService,
  Collaborator,
  AccessRole,
} from "../../services/repoService";

const ManageAccess = ({ repoId }: { repoId: string }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AccessRole>("read");

  useEffect(() => {
    loadCollaborators();
  }, [repoId]);

  const loadCollaborators = async () => {
    try {
      const data = await repoService.getCollaborators(repoId);
      setCollaborators([...data]); // Clone to trigger re-render
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AccessRole) => {
    // Optimistic update
    setCollaborators((prev) =>
      prev.map((c) => (c.user.id === userId ? { ...c, role: newRole } : c)),
    );
    await repoService.updateRole(repoId, userId, newRole);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    await repoService.inviteCollaborator(repoId, inviteEmail, inviteRole);
    setInviteEmail("");
    loadCollaborators();
  };

  if (loading)
    return (
      <div className="p-10 text-center text-[#8b949e]">
        Loading access settings...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Who has access</h2>
          <p className="text-sm text-[#8b949e]">
            Manage permissions for this repository.
          </p>
        </div>
        <button className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-md text-sm transition-colors shadow-lg shadow-green-900/20">
          Add people
        </button>
      </div>

      {/* Public/Private Status Box */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined !text-3xl text-[#8b949e]">
            lock
          </span>
          <div>
            <h3 className="font-bold text-[#c9d1d9]">Private repository</h3>
            <p className="text-xs text-[#8b949e]">
              Only those with access to this repository can view it.
            </p>
          </div>
        </div>
        <button className="text-[#58a6ff] text-sm font-bold hover:underline">
          Manage
        </button>
      </div>

      {/* Invite Input (Mock) */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 mb-8">
        <label className="block text-xs font-bold text-[#c9d1d9] mb-2 uppercase tracking-wide">
          Invite a collaborator
        </label>
        <div className="flex gap-2">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="username or email"
            className="flex-1 bg-[#161b22] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white focus:border-[#58a6ff] outline-none"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as AccessRole)}
            aria-label="Select invite role"
            className="bg-[#161b22] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-white focus:border-[#58a6ff] outline-none cursor-pointer"
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail}
            className="px-4 py-1.5 bg-[#1f6feb] text-white font-bold rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Invite
          </button>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="border border-[#30363d] rounded-lg overflow-hidden">
        {collaborators.map((member) => (
          <div
            key={member.user.id}
            className="flex items-center justify-between p-4 bg-[#0d1117] border-b border-[#30363d] last:border-0 hover:bg-[#161b22] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <img
                src={member.user.avatar}
                alt={member.user.name}
                className="size-10 rounded-full border border-[#30363d]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#c9d1d9]">
                    {member.user.name}
                  </span>
                  <span className="text-xs text-[#8b949e]">
                    @{member.user.id}
                  </span>
                  {member.role === "owner" && (
                    <span className="text-[10px] border border-[#30363d] px-1.5 rounded-full text-[#8b949e]">
                      Owner
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#8b949e]">
                  Joined {member.joinedAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={member.role}
                disabled={member.role === "owner"}
                aria-label={`Change role for ${member.user.name}`}
                onChange={(e) =>
                  handleRoleChange(member.user.id, e.target.value as AccessRole)
                }
                className="bg-transparent text-sm text-[#c9d1d9] font-medium focus:text-white border-none outline-none cursor-pointer disabled:cursor-default disabled:opacity-70"
              >
                <option value="owner" disabled>
                  Owner
                </option>
                <option value="admin">Admin</option>
                <option value="write">Write</option>
                <option value="read">Read</option>
              </select>
              <button
                className="text-[#8b949e] hover:text-[#f85149] transition-colors"
                title="Remove"
              >
                <span className="material-symbols-outlined !text-[20px]">
                  close
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAccess;
