import React from "react";
import { Job } from "../../../types";

interface JobAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Job;
}

const JobAcceptanceModal: React.FC<JobAcceptanceModalProps> = ({
  isOpen,
  onClose,
  offer,
}) => {
  if (!isOpen) return null;

  const details = offer.offerDetails || {
    baseSalary: "$140,000",
    equity: "0.1%",
    signOnBonus: "$10,000",
    startDate: "October 15, 2024",
    reportingManager: "Alex Rivera",
    officeLocation: "Remote",
    includeRelocation: false,
    customNDA: false,
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0d1117]/95 backdrop-blur-sm animate-in fade-in duration-300 font-display">
      <div className="w-full h-full max-w-[1400px] flex flex-col md:flex-row overflow-hidden bg-[#0d1117] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Left Panel: Highlights */}
        <div className="w-full md:w-1/3 p-10 flex flex-col justify-center border-r border-[#30363d] bg-[#161b22] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

          <div className="mb-10">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Ready for Review
            </span>
            <h1 className="text-5xl font-black text-white mt-6 leading-tight tracking-tight">
              Congratulations, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Candidate!
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-4 leading-relaxed">
              Your offer from{" "}
              <strong className="text-white">TrackCodex Inc.</strong> is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] p-6 rounded-2xl">
              <span className="material-symbols-outlined text-emerald-500 mb-2">
                payments
              </span>
              <h3 className="text-3xl font-bold text-white">
                {details.baseSalary}
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                Annual Base Salary
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-[#0d1117] border border-[#30363d] p-6 rounded-2xl">
                <span className="material-symbols-outlined text-purple-500 mb-2">
                  pie_chart
                </span>
                <h3 className="text-xl font-bold text-white">
                  {details.equity}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Equity
                </p>
              </div>
              <div className="flex-1 bg-[#0d1117] border border-[#30363d] p-6 rounded-2xl">
                <span className="material-symbols-outlined text-amber-500 mb-2">
                  redeem
                </span>
                <h3 className="text-xl font-bold text-white">
                  {details.signOnBonus}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Sign-on Bonus
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-[#30363d]">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500">
                verified
              </span>
              Offer Highlights
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                Reporting to{" "}
                <strong className="text-white">
                  {details.reportingManager}
                </strong>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                Start Date:{" "}
                <strong className="text-white">{details.startDate}</strong>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                Location:{" "}
                <strong className="text-white">{details.officeLocation}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel: The Document */}
        <div className="flex-1 bg-white relative flex flex-col">
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">
                description
              </span>
              <span className="text-sm font-bold text-slate-700">
                Employment_Agreement_Final.pdf
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
                <span className="material-symbols-outlined !text-[18px]">
                  zoom_in
                </span>
              </button>
              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600">
                <span className="material-symbols-outlined !text-[18px]">
                  download
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-12 bg-slate-100 flex justify-center">
            <div className="bg-white w-full max-w-[800px] shadow-sm p-16 min-h-[1000px] text-slate-800 font-serif leading-relaxed">
              <div className="flex justify-between items-start mb-16">
                <div className="text-4xl">💎</div>
                <div className="text-right text-[10px] text-slate-400 font-sans uppercase tracking-widest">
                  TrackCodex Inc.
                  <br />
                  123 Tech Plaza
                  <br />
                  {details.officeLocation
                    ? details.officeLocation.split("(")[0].trim()
                    : "San Francisco, CA"}
                </div>
              </div>

              <h2 className="text-3xl font-bold font-sans mb-8 text-slate-900 border-b-4 border-emerald-500 pb-4 inline-block">
                Offer of Employment
              </h2>

              <p className="mb-6">Dear Candidate,</p>
              <p className="mb-6">
                We are thrilled to offer you the position of{" "}
                <strong>{offer.title}</strong> at TrackCodex Inc. Your technical
                skills and contributions during the trial phase impressed the
                entire team.
              </p>

              <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-lg text-sm font-sans">
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Base Salary
                  </div>
                  <div className="font-bold text-slate-900">
                    {details.baseSalary} per annum
                  </div>

                  <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Equity
                  </div>
                  <div className="font-bold text-slate-900">
                    {details.equity} options
                  </div>

                  <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Sign-on Bonus
                  </div>
                  <div className="font-bold text-slate-900">
                    {details.signOnBonus}
                  </div>
                </div>
              </div>

              <p className="mb-6">
                This position is located in our{" "}
                <strong>{details.officeLocation}</strong> office (or remote
                equivalent). You will be reporting directly to{" "}
                <strong>{details.reportingManager}</strong>.
              </p>

              <p className="mb-12">
                Please review the full terms of employment attached to this
                letter. To accept this offer, please sign below.
              </p>

              <div className="mt-20 pt-8 border-t border-slate-300">
                <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Sign Here
                </div>
                <div className="h-16 border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 italic font-cursive text-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  Click to sign electronically
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="text-xs text-slate-500">
              By signing, you agree to the Terms of Service and Privacy Policy.
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 font-bold text-slate-600 hover:text-slate-900"
              >
                Decline Offer
              </button>
              <button
                onClick={() => {
                  alert("Offer Accepted! Welcome aboard.");
                  onClose();
                }}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
              >
                Sign and Accept Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAcceptanceModal;
