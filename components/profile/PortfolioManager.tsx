import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
  technologies: string[];
  featured: boolean;
  order: number;
}

export const PortfolioManager: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Visibility settings
  const [showPortfolio, setShowPortfolio] = useState(true);
  const [showRepositories, setShowRepositories] = useState(true);
  const [showContributions, setShowContributions] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    demoUrl: "",
    sourceUrl: "",
    technologies: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchItems();
      fetchVisibilitySettings();
    }
  }, [user?.id]);

  const fetchVisibilitySettings = async () => {
    try {
      const response = await fetch(`/api/v1/users/${user?.id}`);
      const data = await response.json();
      if (data.user) {
        setShowPortfolio(data.user.showPortfolio ?? true);
        setShowRepositories(data.user.showRepositories ?? true);
        setShowContributions(data.user.showContributions ?? true);
      }
    } catch (error) {
      console.error("Failed to fetch visibility settings:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/v1/portfolio/${user?.id}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      demoUrl: formData.demoUrl || undefined,
      sourceUrl: formData.sourceUrl || undefined,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = editingId
        ? `/api/v1/portfolio/${editingId}`
        : "/api/v1/portfolio";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        await fetchItems();
        resetForm();
      } else {
        alert(data.error || "Failed to save portfolio item");
      }
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      alert("Failed to save portfolio item");
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || "",
      demoUrl: item.demoUrl || "",
      sourceUrl: item.sourceUrl || "",
      technologies: item.technologies.join(", "),
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/portfolio/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        await fetchItems();
      } else {
        alert(data.error || "Failed to delete portfolio item");
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      alert("Failed to delete portfolio item");
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/v1/portfolio/${id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ featured: !featured }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchItems();
      } else {
        alert(data.error || "Failed to update featured status");
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to update featured status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      demoUrl: "",
      sourceUrl: "",
      technologies: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const updateVisibility = async (field: string, value: boolean) => {
    try {
      const response = await fetch(`/api/v1/portfolio/${user?.id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [field]: value }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        if (field === "showPortfolio") setShowPortfolio(value);
        if (field === "showRepositories") setShowRepositories(value);
        if (field === "showContributions") setShowContributions(value);
      } else {
        alert(data.error || "Failed to update visibility");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility");
    }
  };

  if (loading) {
    return <div className="p-6">Loading portfolio items...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gh-text">
            Portfolio Items
          </h2>
          <p className="text-sm text-gh-text-secondary mt-1">
            Manage your portfolio projects (max 20 items, pin up to 6)
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gh-btn-primary text-white rounded-md hover:bg-gh-btn-primary-hover"
            disabled={items.length >= 20}
          >
            <span className="material-symbols-outlined !text-[18px] inline-block mr-2">
              add
            </span>
            Add Item
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 border border-gh-border rounded-lg bg-gh-bg-secondary">
          <h3 className="text-lg font-semibold text-gh-text mb-4">
            {editingId ? "Edit" : "Add"} Portfolio Item
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="portfolio-title"
                className="block text-sm font-medium text-gh-text mb-1"
              >
                Title *
              </label>
              <input
                id="portfolio-title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text"
                required
                aria-label="Portfolio item title"
              />
            </div>

            <div>
              <label
                htmlFor="portfolio-description"
                className="block text-sm font-medium text-gh-text mb-1"
              >
                Description *
              </label>
              <textarea
                id="portfolio-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gh-text mb-1">
                Technologies (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                placeholder="React, TypeScript, PostgreSQL"
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="portfolio-image-url"
                  className="block text-sm font-medium text-gh-text mb-1"
                >
                  Image URL
                </label>
                <input
                  id="portfolio-image-url"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text"
                  aria-label="Portfolio item image URL"
                />
              </div>

              <div>
                <label
                  htmlFor="portfolio-demo-url"
                  className="block text-sm font-medium text-gh-text mb-1"
                >
                  Demo URL
                </label>
                <input
                  id="portfolio-demo-url"
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, demoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text"
                  aria-label="Portfolio item demo URL"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="portfolio-source-url"
                className="block text-sm font-medium text-gh-text mb-1"
              >
                Source URL (GitHub, GitLab, TrackCodex)
              </label>
              <input
                id="portfolio-source-url"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) =>
                  setFormData({ ...formData, sourceUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text"
                aria-label="Portfolio item source code URL"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gh-btn-primary text-white rounded-md hover:bg-gh-btn-primary-hover"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gh-bg border border-gh-border text-gh-text rounded-md hover:bg-gh-bg-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio Items List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gh-text-secondary">
            <span className="material-symbols-outlined !text-[48px] block mb-2 opacity-50">
              inventory_2
            </span>
            <p>No portfolio items yet. Add your first project!</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gh-border rounded-lg bg-gh-bg hover:border-gh-border-hover transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gh-text">
                      {item.title}
                    </h3>
                    {item.featured && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 text-xs rounded">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gh-text-secondary mt-1">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gh-btn-primary/10 text-gh-btn-primary text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gh-text-secondary">
                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gh-link"
                      >
                        Demo →
                      </a>
                    )}
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gh-link"
                      >
                        Source →
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleFeatured(item.id, item.featured)}
                    disabled={
                      !item.featured &&
                      items.filter((i) => i.featured).length >= 6
                    }
                    className={`p-2 rounded ${
                      !item.featured &&
                      items.filter((i) => i.featured).length >= 6
                        ? "opacity-50 cursor-not-allowed text-gh-text-secondary"
                        : "hover:bg-gh-bg-secondary"
                    }`}
                    title={
                      item.featured
                        ? "Unpin"
                        : items.filter((i) => i.featured).length >= 6
                          ? "Max 6 items pinned"
                          : "Pin"
                    }
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {item.featured ? "push_pin" : "keep"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 hover:bg-gh-bg-secondary rounded"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-gh-bg-secondary rounded text-red-500"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <p className="text-xs text-gh-text-secondary mt-4">
          {items.length} / 20 items • {items.filter((i) => i.featured).length} /
          6 pinned
        </p>
      )}
    </div>
  );
};
