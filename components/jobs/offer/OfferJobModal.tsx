import React, { useState } from "react";
import { Job } from "../../../types";
import { profileService } from "../../../services/profile";
import { jobOfferService } from "../../../services/jobOfferService";
import JobAcceptanceModal from "./JobAcceptanceModal";

interface OfferJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    name: string;
    username: string;
  };
}

const OfferJobModal: React.FC<OfferJobModalProps> = ({
  isOpen,
  onClose,
  targetUser,
}) => {
  const userProfile = profileService.getProfile();
  // Enhanced state for the full editor
  const [formData, setFormData] = useState({
    title: "Senior Software Engineer",
    baseSalary: "185,000",
    equity: "15,000",
    signOnBonus: "20,000",
    startDate: "2024-10-15",
    reportingManager: `${userProfile.name} (${userProfile.role || "Hiring Manager"})`,
    officeLocation: userProfile.location
      ? `${userProfile.location} (Hybrid)`
      : "San Francisco, CA (Hybrid)",
    includeRelocation: true,
    customNDA: false,
    prerequisites: "",
    personalNote: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAcceptancePreview, setShowAcceptancePreview] = useState(false);
  const [createdJob, setCreatedJob] = useState<Job | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the job object with richness
    const job = jobOfferService.createOffer({
      title: formData.title,
      description: "Full-time employment offer via TrackCodex.",
      budget: `$${formData.baseSalary}`,
      techStack: ["React", "Node", "Rust"],
      targetUserId: targetUser.username,
      offerDetails: {
        baseSalary: `$${formData.baseSalary} USD`,
        equity: `${formData.equity} Options`,
        signOnBonus: `$${formData.signOnBonus} USD`,
        startDate: formData.startDate,
        reportingManager: formData.reportingManager,
        officeLocation: formData.officeLocation,
        includeRelocation: formData.includeRelocation,
        customNDA: formData.customNDA,
      },
    });

    setCreatedJob(job);

    setTimeout(() => {
      setIsSubmitting(false);
      // Instead of closing, show the "Simulator" of what the candidate sees
      setShowAcceptancePreview(true);
    }, 800);
  };

  if (showAcceptancePreview && createdJob) {
    return (
      <JobAcceptanceModal isOpen={true} onClose={onClose} offer={createdJob} />
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-display">
      <div className="bg-[#0d1117] border border-[#30363d] w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex">
        {/* Sidebar: Approval Workflow */}
        <div className="w-64 border-r border-[#30363d] bg-[#010409] p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
              A
            </div>
            <div className="text-white font-bold leading-tight">
              {targetUser.name}
              <br />
              <span className="text-[10px] text-slate-500 font-normal">
                Candidate
              </span>
            </div>
          </div>

          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
            Approval Workflow
          </h3>
          <div className="space-y-6 relative">
            <div className="absolute top-2 left-2.5 w-0.5 h-full bg-[#30363d] -z-10"></div>

            <div className="flex items-start gap-3">
              <div className="size-5 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5 ring-4 ring-[#010409]">
                <span className="material-symbols-outlined !text-[12px] text-black">
                  check
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">HR Review</div>
                <div className="text-[10px] text-emerald-500">
                  Approved by Sarah K.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 ring-4 ring-[#010409] animate-pulse">
                <span className="material-symbols-outlined !text-[12px] text-white">
                  schedule
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Dept Head Approval
                </div>
                <div className="text-[10px] text-blue-400">Current Stage</div>
              </div>
            </div>

            <div className="flex items-start gap-3 opacity-50">
              <div className="size-5 rounded-full bg-[#30363d] flex items-center justify-center mt-0.5 ring-4 ring-[#010409]"></div>
              <div>
                <div className="text-xs font-bold text-white">
                  Finance Verification
                </div>
                <div className="text-[10px] text-slate-500">Waiting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col bg-[#0d1117] min-w-0">
          <div className="h-16 border-b border-[#30363d] flex items-center justify-between px-6 bg-[#161b22]">
            <h2 className="text-lg font-bold text-white">
              Offer Details & Terms
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 hover:bg-[#30363d] text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-colors"
              >
                Save Draft
              </button>
              <button
                form="offer-form"
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? "Processing..." : "Send Offer"}
                <span className="material-symbols-outlined !text-[16px]">
                  send
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <form
              id="offer-form"
              onSubmit={handleSubmit}
              className="max-w-2xl space-y-8"
            >
              <section>
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">
                  Compensation
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Base Salary (Annual)
                    </label>
                    <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-lg px-3 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                      <span className="text-slate-500 text-xs">USD</span>
                      <input
                        type="text"
                        aria-label="Base Salary"
                        className="w-full bg-transparent border-none py-2.5 text-sm text-white focus:ring-0 outline-none"
                        value={formData.baseSalary}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            baseSalary: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Equity (Options)
                    </label>
                    <input
                      aria-label="Equity Options"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      value={formData.equity}
                      onChange={(e) =>
                        setFormData({ ...formData, equity: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Sign-on Bonus
                    </label>
                    <input
                      aria-label="Sign-on Bonus"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      value={formData.signOnBonus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          signOnBonus: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              <div className="h-px bg-[#30363d]"></div>

              <section>
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">
                  Logistics
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      aria-label="Start Date"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Reporting Manager
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-[18px]">
                        person
                      </span>
                      <input
                        aria-label="Reporting Manager"
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        value={formData.reportingManager}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reportingManager: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Office Location
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 !text-[18px]">
                        location_on
                      </span>
                      <input
                        aria-label="Office Location"
                        className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        value={formData.officeLocation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            officeLocation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-2">
                      Prerequisites / Requirements
                    </label>
                    <textarea
                      placeholder="e.g. Must have active clearance, 3 years React experience..."
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                      value={formData.prerequisites}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prerequisites: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="bg-[#161b22] rounded-xl p-4 border border-[#30363d] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Include Relocation Package
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle Relocation Package"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        includeRelocation: !formData.includeRelocation,
                      })
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors ${formData.includeRelocation ? "bg-blue-600" : "bg-[#30363d]"}`}
                  >
                    <div
                      className={`absolute top-1 left-1 size-3 bg-white rounded-full transition-transform ${formData.includeRelocation ? "translate-x-5" : ""}`}
                    ></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Custom NDA Required
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle Custom NDA"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        customNDA: !formData.customNDA,
                      })
                    }
                    className={`w-10 h-5 rounded-full relative transition-colors ${formData.customNDA ? "bg-blue-600" : "bg-[#30363d]"}`}
                  >
                    <div
                      className={`absolute top-1 left-1 size-3 bg-white rounded-full transition-transform ${formData.customNDA ? "translate-x-5" : ""}`}
                    ></div>
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferJobModal;
