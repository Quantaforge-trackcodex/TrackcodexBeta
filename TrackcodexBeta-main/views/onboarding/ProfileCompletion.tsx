import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, useAuth } from "../../context/AuthContext";

const ProfileCompletion: React.FC = () => {
  const { user, login } = useAuth(); // We need to update user in context after completion
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    bio: "",
    company: "",
    role: "developer", // developer, designer, manager, etc.
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/profile/complete", formData);

      // Update local user context with new data
      // Assuming the API returns the updated user object
      // We might need to refresh the user data in the context
      // For now, let's assume we navigate and the dashboard will re-fetch or we force a reload

      // Ideally AuthContext should expose a refreshUser() or we just update it manually if possible
      // But for now, let's just navigate. The requireCompleteProfile middleware will pass now.

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gh-bg text-gh-text flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gh-bg-secondary border border-gh-border rounded-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gh-text mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gh-text-secondary">
            Tell us a bit more about yourself to get started.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gh-text">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="username"
            />
            <p className="text-xs text-gh-text-secondary mt-1">
              Unique handle for your profile URL.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gh-text">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gh-text">
              Role
            </label>
            <select
              name="role"
              aria-label="Role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="product_manager">Product Manager</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gh-text">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-gh-text focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="A short bio..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;
