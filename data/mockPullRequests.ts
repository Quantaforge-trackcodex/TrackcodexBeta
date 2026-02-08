export interface PullRequest {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  status: "open" | "closed" | "merged";
  createdAt: string;
  number: number;
  labels: { name: string; color: string }[];
  commentsCount: number;
  checks: {
    status: "success" | "failure" | "pending";
    text: string;
  };
  diffStats: {
    additions: number;
    deletions: number;
    files: number;
  };
  reviews?: {
    id: string;
    reviewer: {
      username: string;
      avatar?: string;
    };
    status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED";
    body?: string;
  }[];
}

export const MOCK_PULL_REQUESTS: PullRequest[] = [
  {
    id: 101,
    title: "feat: Add dark mode support to Dashboard",
    number: 42,
    author: {
      name: "sarah_dev",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    status: "open",
    createdAt: "2 hours ago",
    labels: [
      { name: "feature", color: "#a2eeef" },
      { name: "ui", color: "#d73a49" },
    ],
    commentsCount: 5,
    checks: { status: "success", text: "All checks passed" },
    diffStats: { additions: 450, deletions: 23, files: 12 },
  },
  {
    id: 102,
    title: "fix: Resolve race condition in auth service",
    number: 41,
    author: {
      name: "mike_security",
      avatar: "https://i.pravatar.cc/150?u=mike",
    },
    status: "merged",
    createdAt: "1 day ago",
    labels: [
      { name: "bug", color: "#d73a49" },
      { name: "critical", color: "#b60205" },
    ],
    commentsCount: 12,
    checks: { status: "success", text: "All checks passed" },
    diffStats: { additions: 12, deletions: 8, files: 2 },
  },
  {
    id: 103,
    title: "chore: Update dependency versions",
    number: 39,
    author: {
      name: "bot_dep",
      avatar: "https://i.pravatar.cc/150?u=bot",
    },
    status: "closed",
    createdAt: "3 days ago",
    labels: [{ name: "dependencies", color: "#0366d6" }],
    commentsCount: 1,
    checks: { status: "failure", text: "Build failed" },
    diffStats: { additions: 1204, deletions: 1100, files: 45 },
  },
];
