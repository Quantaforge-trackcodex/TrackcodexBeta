import React, { useState, useRef } from "react";
import { Repository } from "../../types";

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (repo: Partial<Repository>) => void;
}

const CreateRepoModal: React.FC<CreateRepoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    techStack: "TypeScript",
    visibility: "PUBLIC" as "PUBLIC" | "PRIVATE",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      logo: logoPreview,
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      stars: 0,
      forks: 0,
      aiHealth: "A",
      aiHealthLabel: "Healthy",
      securityStatus: "Passing",
      lastUpdated: "Just now",
      techColor:
        formData.techStack === "TypeScript"
          ? "#3178c6"
          : formData.techStack === "Go"
            ? "#00add8"
            : formData.techStack === "Rust"
              ? "#f97316"
              : "#888",
    });
    setFormData({
      name: "",
      description: "",
      techStack: "TypeScript",
      visibility: "PUBLIC",
    });
    setLogoPreview(null);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#161b22] border border-primary/30 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col font-display">
        <div className="p-6 border-b border-[#30363d] bg-primary/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">
              Initialize Repository
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
              TrackCodex Standalone Engine
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">
                  Logo
                </label>
                <div className="relative group/avatar">
                  <div className="size-24 rounded-2xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        className="size-full object-cover"
                        alt="Repo logo preview"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-600 !text-4xl">
                        add_photo_alternate
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-2xl"
                  >
                    <span className="material-symbols-outlined text-white">
                      edit
                    </span>
                  </button>
                  <input
                    id="repo-logo-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload repository logo"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">
                  Repository Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="my-awesome-project"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">
                Short Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What are you building?"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white h-24 resize-none outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="repo-tech-stack"
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1"
                >
                  Primary Tech Stack
                </label>
                <select
                  id="repo-tech-stack"
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({ ...formData, techStack: e.target.value })
                  }
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none appearance-none"
                  aria-label="Select primary technology stack"
                >
                  <option>TypeScript</option>
                  <option>Go</option>
                  <option>Rust</option>
                  <option>Python</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">
                  Visibility
                </label>
                <div className="flex bg-[#0d1117] border border-[#30363d] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, visibility: "PUBLIC" })
                    }
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.visibility === "PUBLIC" ? "bg-primary text-primary-foreground shadow-lg" : "text-slate-500"}`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, visibility: "PRIVATE" })
                    }
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.visibility === "PRIVATE" ? "bg-primary text-primary-foreground shadow-lg" : "text-slate-500"}`}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-[#30363d]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-bold text-slate-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95"
            >
              Create Repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRepoModal;
