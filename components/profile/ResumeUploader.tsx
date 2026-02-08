import React, { useState, useCallback } from "react";
import { Upload, FileText, Trash2, Download, Eye, EyeOff } from "lucide-react";

interface ResumeUploaderProps {
  userId: string;
  currentResume?: {
    filename: string;
    url: string;
    uploadedAt: string;
  };
  showResume: boolean;
  onUploadSuccess: () => void;
  onDeleteSuccess: () => void;
  onPrivacyChange: (show: boolean) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  userId,
  currentResume,
  showResume,
  onUploadSuccess,
  onDeleteSuccess,
  onPrivacyChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, DOCX, and TXT files are allowed");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`/api/v1/profile/${userId}/resume`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      onUploadSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/v1/profile/${userId}/resume`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Delete failed");
      }

      onDeleteSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Resume Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Resume / CV</h3>
          <p className="text-sm text-slate-400 mt-1">
            Upload your resume for recruiters and hiring managers
          </p>
        </div>
        {currentResume && (
          <button
            onClick={() => onPrivacyChange(!showResume)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            {showResume ? (
              <>
                <Eye size={16} /> Public
              </>
            ) : (
              <>
                <EyeOff size={16} /> Private
              </>
            )}
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Current Resume Display */}
      {currentResume ? (
        <div className="p-6 bg-[#1a1a1f] border border-white/10 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FileText className="text-purple-400" size={24} />
              </div>
              <div>
                <h4 className="text-white font-medium">
                  {currentResume.filename}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Uploaded{" "}
                  {new Date(currentResume.uploadedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-3">
                  <a
                    href={`/api/v1/profile/${userId}/resume`}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium transition-colors"
                  >
                    <Download size={14} /> Download
                  </a>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative p-12 border-2 border-dashed rounded-xl transition-all ${
            dragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/10 bg-[#1a1a1f]"
          }`}
        >
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                <Upload className="text-purple-400" size={32} />
              </div>
              <h4 className="text-white font-medium mb-2">
                {uploading
                  ? "Uploading..."
                  : "Drop your resume here or click to browse"}
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                Supports PDF, DOC, DOCX, TXT (Max 5MB)
              </p>
              {!uploading && (
                <div className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors">
                  Select File
                </div>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
        <strong>💡 Tip:</strong> Your resume will only be visible to others if
        you set it to "Public". You can toggle this anytime.
      </div>
    </div>
  );
};

export default ResumeUploader;
