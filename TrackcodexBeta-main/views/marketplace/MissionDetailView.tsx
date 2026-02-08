import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_JOBS, MOCK_TRIAL_REPOS } from "../../constants";
import { Job, TrialRepo } from "../../types";
import JobRatingModal from "../../components/jobs/JobRatingModal";
import { profileService } from "../../services/profile";
import { directMessageBus } from "../../services/directMessageBus";

const MissionDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [localJob, setLocalJob] = useState<Job | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (!id) return;

    // Check local mocks first for immediate display (Search results mainly return mocks)
    const localMock = MOCK_JOBS.find((j) => j.id === id);
    if (localMock) {
      setLocalJob(localMock);
      return;
    }

    // Check Trial Repos if not found in Jobs
    const trialMock = MOCK_TRIAL_REPOS.find((t) => t.id === id);
    if (trialMock) {
      // Map TrialRepo to Job structure
      const adaptedJob: Job = {
        id: trialMock.id,
        title: trialMock.title,
        description: trialMock.description,
        longDescription: trialMock.description, // Fallback
        budget: trialMock.salaryRange,
        type: "Contract", // Or 'Full-time' based on trial
        status: "Open",
        creator: {
          id: "company-" + trialMock.company,
          name: trialMock.company,
          avatar: trialMock.logo,
          role: "Enterprise Client",
        },
        techStack: trialMock.tech,
        postedAt: "Now",
        repoId: trialMock.repoName, // Assuming logic handles strings or IDs
        applications: 0,
        readme: trialMock.readme, // Map readme
      } as any; // Cast as any if Job type is strict and we miss fields, but try to match mostly.

      setLocalJob(adaptedJob);
      return;
    }

    fetch(`http://localhost:4000/api/v1/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Job not found");
        return res.json();
      })
      .then((data) => {
        setLocalJob(data);
      })
      .catch((err) => {
        console.warn("Failed to fetch job", err);
        // Fallback or show error
      });
  }, [id]);

  if (!localJob)
    return (
      <div className="p-8 text-center text-slate-400">Mission not found.</div>
    );

  const handleStartWork = () => navigate(`/workspace/${localJob.repoId}`);
  const handleMessageClient = () => {
    directMessageBus.openChat({
      id: localJob.creator.name.replace(/\s+/g, "").toLowerCase(),
      name: localJob.creator.name,
      avatar: localJob.creator.avatar,
      context: `Mission: ${localJob.title}`,
    });
  };
  // Determine if current user is creator (Mock: assuming yes for demo or check against first user)
  // For 'Real', we should check auth context.
  // Assuming we are logged in as 'johndoe' (creator of many mock jobs) or similar.

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    if (!localJob) return;

    try {
      // We need freelancerId. In a real flow, this comes from the accepted application.
      // For this demo 'real' flow, let's assume the job has an 'acceptedApplicantId'
      // OR we just assume the first applicant or a specific user 'freelancer-user-id'
      // Let's use a known ID for the test freelancer 'testuser-id' or 'derived-from-applicant'

      // BETTER: Retrieve accepted applicant from job applications.
      // If mocked/missing, we fallback to a hardcoded test ID so the flow works.
      const freelancerId = "test-user-id-for-demo"; // In prod: localJob.acceptedApplicantId

      await fetch(`http://localhost:4000/api/v1/jobs/${localJob.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          feedback,
          freelancerId,
        }),
      });

      // Refresh
      setLocalJob({ ...localJob, status: "Completed" }); // Optimistic update
      setIsRatingModalOpen(false);
      // Optionally navigate to profile to see the rating update?
    } catch (e) {
      console.error("Failed to complete job", e);
    }
  };

  const isCompleted = localJob?.status === "Completed";

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
        <div className="space-y-12">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Mission Briefing
              </h2>
              {isCompleted && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
                  COMPLETED
                </span>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gh-text-secondary leading-relaxed font-medium">
                {localJob.longDescription || localJob.description}
              </p>

              {/* README Rendering for Trial Jobs */}
              {(localJob as any).readme && (
                <div className="mt-12 border-t border-[#30363d] pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-[#8b949e]">
                      menu_book
                    </span>
                    <h3 className="text-[11px] font-black text-gh-text-secondary uppercase tracking-[0.2em]">
                      Repository README
                    </h3>
                  </div>
                  <div className="bg-gh-bg border border-gh-border rounded-xl p-8 overflow-auto">
                    <pre className="text-gh-text font-mono text-sm whitespace-pre-wrap">
                      {(localJob as any).readme}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section>
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">
              Required Capabilities
            </h3>
            <div className="flex flex-wrap gap-3">
              {localJob.techStack.map((skill) => (
                <span
                  key={skill}
                  className="px-5 py-2.5 bg-gh-bg border border-gh-border rounded-xl text-[13px] font-bold text-gh-text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-10">
          <div className="p-8 rounded-3xl bg-gh-bg-secondary border border-gh-border shadow-2xl">
            <h3 className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.2em] mb-8">
              Mission Value
            </h3>
            <div>
              <p className="text-4xl font-black text-gh-text tracking-tighter mb-1">
                {localJob.budget}
              </p>
              <p className="text-[11px] text-gh-text-secondary uppercase font-black tracking-widest">
                Total Contract Payout
              </p>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-gh-bg-secondary border border-gh-border shadow-xl">
            <h3 className="text-[10px] font-black text-gh-text-secondary uppercase tracking-[0.2em] mb-8">
              Contracting Client
            </h3>
            <div className="flex items-center gap-5 mb-8">
              <img
                src={localJob.creator.avatar}
                className="size-16 rounded-2xl border-2 border-primary/20 object-cover"
                alt="Client"
              />
              <div>
                <p className="text-lg font-black text-gh-text leading-tight uppercase">
                  {localJob.creator.name}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleMessageClient}
                className="flex-1 py-3 bg-gh-bg border border-gh-border text-gh-text-secondary hover:text-gh-text rounded-xl text-[10px] font-black uppercase transition-colors"
              >
                Send DM
              </button>
              <button className="flex-1 py-3 bg-gh-bg border border-gh-border text-gh-text-secondary hover:text-gh-text rounded-xl text-[10px] font-black uppercase transition-colors">
                Profile
              </button>
            </div>

            {/* Financial Actions (Escrow) */}
            {localJob.status === "Open" && (
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await fetch(
                      `http://localhost:4000/api/v1/jobs/${localJob.id}/apply`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ applicantId: "user-2" }), // Mock Freelancer
                      },
                    );
                    alert("Application Sent!");
                  }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                >
                  Apply for Mission
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Fund ${localJob.budget} for this mission?`))
                      return;
                    await fetch(
                      `http://localhost:4000/api/v1/jobs/${localJob.id}/fund`,
                      {
                        method: "POST",
                        headers: { "x-user-id": "user-1" }, // Mock Employer
                      },
                    );
                    alert("Funds Secured in Escrow");
                    window.location.reload();
                  }}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                >
                  Secure Funding
                </button>
              </div>
            )}

            {localJob.status === "Completed" && ( // Should check Escrow status too
              <button
                onClick={async () => {
                  // Mock Freelancer ID for demo logic
                  await fetch(
                    `http://localhost:4000/api/v1/jobs/${localJob.id}/release`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ freelancerId: "freelancer-1" }),
                    },
                  );
                  alert("Payment Released");
                  window.location.reload();
                }}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
              >
                <span className="material-symbols-outlined text-sm align-bottom mr-2">
                  payments
                </span>
                Release Payment
              </button>
            )}

            {/* Complete Job Action */}
            {!isCompleted && (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
              >
                Mark Complete & Rate
              </button>
            )}
          </div>
        </aside>
      </div>
      <JobRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default MissionDetailView;
