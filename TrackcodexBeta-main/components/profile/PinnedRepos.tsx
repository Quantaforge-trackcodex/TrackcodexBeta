import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PinnedRepos.module.css";

const REPOS = [
  {
    displayName: "RUST-CR...",
    id: "rust-crypto-guard",
    desc: "High-performance cryptographic primitives for secure...",
    lang: "Rust",
    langColor: "#f97316",
    stars: "1.2k",
    forks: 142,
    health: "A+",
    assist: "45%",
  },
  {
    displayName: "FORGE-AI...",
    id: "forge-ai-security",
    desc: "Automated vulnerability scanning pipeline leveraging LLMs for co...",
    lang: "Python",
    langColor: "#135bec",
    stars: "856",
    forks: 89,
    health: "A",
    assist: "90%",
  },
];

const PinnedRepos = () => {
  const navigate = useNavigate();
  const [pinnedRepos, setPinnedRepos] = React.useState<any[]>(REPOS);

  React.useEffect(() => {
    const token = localStorage.getItem("trackcodex_git_token");
    if (token) {
      import("../../services/github").then(({ githubService }) => {
        githubService
          .getRepos(token)
          .then((repos) => {
            // Sort by stars descending and take top 2
            const topRepos = repos
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 2);

            if (topRepos.length > 0) {
              const mapped = topRepos.map((repo) => ({
                id: String(repo.id),
                displayName: repo.name,
                desc: repo.description || "No description provided.",
                lang: repo.language || "Plain Text",
                langColor:
                  repo.language === "TypeScript"
                    ? "#3178c6"
                    : repo.language === "JavaScript"
                      ? "#f1e05a"
                      : repo.language === "Rust"
                        ? "#dea584"
                        : "#8b949e",
                stars: String(repo.stargazers_count),
                forks: repo.forks_count,
                health: "A", // Stub
                assist: "N/A",
              }));
              setPinnedRepos(mapped);
            }
          })
          .catch((err) => console.error("Failed to fetch pinned repos", err));
      });
    }
  }, []);

  return (
    <div className="font-display">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-gh-text-secondary !text-[20px]">
            bookmark
          </span>
          <h3 className="text-[14px] font-black uppercase tracking-widest text-gh-text">
            Pinned Repositories
          </h3>
        </div>
        <button className="text-[11px] font-black uppercase text-primary tracking-widest hover:underline transition-all">
          Customize pins
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pinnedRepos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => navigate(`/repo/${repo.id}`)}
            className="p-6 bg-gh-bg-secondary border border-gh-border rounded-2xl group hover:border-gh-text-secondary transition-all cursor-pointer flex flex-col shadow-lg hover:shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-gh-text-secondary !text-[20px] shrink-0">
                  book
                </span>
                <h4 className="text-[14px] font-bold text-primary group-hover:underline truncate">
                  {repo.displayName}
                </h4>
                <span className="px-2 py-0.5 rounded-full border border-gh-border text-[9px] text-gh-text-secondary font-black uppercase tracking-widest shrink-0">
                  Public
                </span>
              </div>
              <div
                className={`size-8 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 shadow-md
                ${repo.health.startsWith("A") ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}
              >
                {repo.health}
              </div>
            </div>

            <p className="text-[14px] text-gh-text-secondary leading-normal mb-6 h-12 line-clamp-2 font-medium italic">
              "{repo.desc}"
            </p>

            <div className="flex items-center gap-5 text-[12px] text-gh-text-secondary mt-auto font-bold">
              <div className="flex items-center gap-2">
                <div
                  className={styles.languageDot}
                  style={
                    { "--lang-color": repo.langColor } as React.CSSProperties
                  }
                ></div>
                <span className="text-gh-text-secondary uppercase text-[11px] font-black tracking-wider">
                  {repo.lang}
                </span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-gh-text transition-colors">
                <span className="material-symbols-outlined !text-[16px]">
                  star
                </span>
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-gh-text transition-colors">
                <span className="material-symbols-outlined !text-[16px]">
                  fork_right
                </span>
                <span>{repo.forks}</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-emerald-400 font-black">
                <span className="material-symbols-outlined !text-[16px] filled">
                  auto_fix_high
                </span>
                <span>{repo.assist}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedRepos;
