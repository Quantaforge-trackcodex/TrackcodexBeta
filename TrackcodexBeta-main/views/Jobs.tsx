import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Job } from "../types";
import { CreateJobModal } from "../components/jobs/CreateJobModal";
import Spinner from "../components/ui/Spinner";

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await api.jobs.list();
        // Robust mapping to handle backend schema variations
        const enriched = data.map((job: any) => ({
          ...job,
          id: job.id || String(Math.random()),
          title: job.title || "Untitled Opportunity",
          description: job.description || "No description provided.",
          budget: job.budget || "Competitive",
          type: job.type || "Full-time",
          techStack: job.techStack || ["TypeScript"],
          postedDate: job.createdAt
            ? new Date(job.createdAt).toLocaleDateString()
            : "Recently",
          creator: job.creator || {
            name: job.org?.name || "System",
            avatar:
              job.org?.avatar ||
              "https://ui-avatars.com/api/?name=TC&background=0D8ABC&color=fff",
          },
        }));
        setJobs(enriched as any);
      } catch (e) {
        console.error("❌ Failed to fetch hardware Jobs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filter === "Full-time") return job.type === "Full-time";
    if (filter === "Contract") return job.type === "Contract";
    if (filter === "Gig") return job.type === "Gig";
    return true;
  });

  if (loading) {
    return (
      <div className="p-20 text-center flex-1 bg-gh-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-gh-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Opportunities
            </h1>
            <p className="text-gh-text-secondary text-sm">
              Discover high-value technical gigs and career-defining roles.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">post_add</span>
            Post a Gig
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          {["All", "Full-time", "Contract", "Gig"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                filter === f
                  ? "bg-primary border-primary text-white"
                  : "bg-gh-bg-secondary border-gh-border text-gh-text-secondary hover:border-gh-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="group bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <img
                      src={job.creator.avatar}
                      alt={job.creator.name}
                      className="size-12 rounded-xl border border-gh-border"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gh-text group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gh-text-secondary mt-1">
                        <span className="font-bold text-gh-text">
                          {job.creator.name}
                        </span>
                        <span>•</span>
                        <span>{job.postedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-500">
                      {job.budget}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gh-text-secondary mt-1">
                      {job.type}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gh-text-secondary mt-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex items-center gap-2 mt-6">
                  {job.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-gh-bg border border-gh-border rounded-md text-[10px] font-bold text-gh-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-gh-bg-secondary border border-gh-border border-dashed rounded-3xl">
              <span className="material-symbols-outlined text-4xl text-gh-text-secondary opacity-30 mb-4">
                search_off
              </span>
              <p className="text-gh-text-secondary font-bold">No jobs found.</p>
            </div>
          )}
        </div>
      </div>

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default Jobs;
