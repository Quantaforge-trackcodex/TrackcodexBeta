import React, { useState } from "react";
import { workspaceCollaborationService } from "../../services/workspaceCollaborationService";
import "../../styles/WorkspaceSecuritySettings.css";

interface WorkspaceSecuritySettingsProps {
  workspaceId: string;
  hasPassword: boolean;
  onPasswordChange: () => void;
}

export const WorkspaceSecuritySettings: React.FC<
  WorkspaceSecuritySettingsProps
> = ({ workspaceId, hasPassword, onPasswordChange }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await workspaceCollaborationService.setWorkspacePassword(
        workspaceId,
        password,
      );
      setSuccess("Password set successfully");
      setPassword("");
      setConfirmPassword("");
      onPasswordChange();
    } catch (err) {
      setError((err as Error).message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePassword = async () => {
    if (!confirm("Are you sure you want to remove password protection?"))
      return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await workspaceCollaborationService.removeWorkspacePassword(workspaceId);
      setSuccess("Password protection removed");
      onPasswordChange();
    } catch (err: any) {
      setError(err.message || "Failed to remove password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace-security-settings">
      <div className="security-header">
        <h3>Password Protection</h3>
        <p className="security-description">
          Protect your private workspace with a password. Members will bypass
          password after joining.
        </p>
      </div>

      {hasPassword ? (
        <div className="password-status">
          <div className="status-indicator active">
            <span className="material-symbols-outlined">lock</span>
            <div>
              <strong>Password protection is enabled</strong>
              <p>This workspace requires a password for access</p>
            </div>
          </div>

          <div className="password-actions">
            <button
              className="change-password-btn"
              onClick={() => setSuccess("")}
            >
              Change Password
            </button>
            <button
              className="remove-password-btn"
              onClick={handleRemovePassword}
              disabled={loading}
            >
              Remove Password
            </button>
          </div>
        </div>
      ) : (
        <div className="password-status">
          <div className="status-indicator inactive">
            <span className="material-symbols-outlined">lock_open</span>
            <div>
              <strong>Password protection is disabled</strong>
              <p>Anyone with access can view this workspace</p>
            </div>
          </div>
        </div>
      )}

      {(!hasPassword || success === "") && (
        <form onSubmit={handleSetPassword} className="password-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min. 8 characters)"
                required
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          <div className="password-strength">
            <div className="strength-bars">
              <div
                className={`strength-bar ${password.length >= 8 ? "active" : ""}`}
              ></div>
              <div
                className={`strength-bar ${password.length >= 12 ? "active" : ""}`}
              ></div>
              <div
                className={`strength-bar ${password.length >= 16 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? "active" : ""}`}
              ></div>
            </div>
            <span className="strength-label">
              {password.length === 0
                ? "Enter a password"
                : password.length < 8
                  ? "Weak"
                  : password.length < 12
                    ? "Fair"
                    : password.length >= 16 &&
                        /[A-Z]/.test(password) &&
                        /[0-9]/.test(password)
                      ? "Strong"
                      : "Good"}
            </span>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="set-password-btn" disabled={loading}>
            {loading
              ? "Setting..."
              : hasPassword
                ? "Update Password"
                : "Set Password"}
          </button>
        </form>
      )}
    </div>
  );
};
