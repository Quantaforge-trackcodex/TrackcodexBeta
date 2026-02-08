export interface JobStep {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failure";
  duration: string;
  logs: string[];
}

export interface WorkflowJob {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failure";
  steps: JobStep[];
}

export interface WorkflowRun {
  id: string;
  name: string; // e.g., "CI - Main Branch"
  commitMsg: string;
  branch: string;
  user: string;
  status: "queued" | "in_progress" | "success" | "failure";
  startTime: string;
  duration: string;
  jobs: WorkflowJob[];
}

export const MOCK_WORKFLOW_RUNS: WorkflowRun[] = [
  {
    id: "run-101",
    name: "Deploy to Production",
    commitMsg: "feat: Add dark mode",
    branch: "main",
    user: "sarah_dev",
    status: "success",
    startTime: "2 minutes ago",
    duration: "4m 12s",
    jobs: [
      {
        id: "job-1",
        name: "Build & Lint",
        status: "success",
        steps: [
          {
            id: "s1",
            name: "Checkout Code",
            status: "success",
            duration: "2s",
            logs: ["Cloning repository...", "Checked out main via SHA"],
          },
          {
            id: "s2",
            name: "Install Dependencies",
            status: "success",
            duration: "45s",
            logs: ["npm install", "Added 124 packages"],
          },
          {
            id: "s3",
            name: "Lint",
            status: "success",
            duration: "12s",
            logs: ["Running eslint...", "No errors found."],
          },
          {
            id: "s4",
            name: "Build",
            status: "success",
            duration: "1m 20s",
            logs: ["Building production bundle...", "Output: /dist/bundle.js"],
          },
        ],
      },
      {
        id: "job-2",
        name: "Unit Tests",
        status: "success",
        steps: [
          {
            id: "s5",
            name: "Run Jest",
            status: "success",
            duration: "1m",
            logs: [
              "PASS src/utils/math.test.ts",
              "PASS src/components/Button.test.ts",
              "Test Suites: 12 passed, 12 total",
            ],
          },
        ],
      },
      {
        id: "job-3",
        name: "Deploy",
        status: "success",
        steps: [
          {
            id: "s6",
            name: "Upload Artifacts",
            status: "success",
            duration: "20s",
            logs: ["Uploading to S3...", "Done."],
          },
          {
            id: "s7",
            name: "Invalidate CloudFront",
            status: "success",
            duration: "5s",
            logs: ["Invalidation ID: XFD123"],
          },
        ],
      },
    ],
  },
  {
    id: "run-102",
    name: "PR #42 Checks",
    commitMsg: "fix: Resolve crash on login",
    branch: "fix/login-crash",
    user: "mike_security",
    status: "failure",
    startTime: "1 hour ago",
    duration: "1m 30s",
    jobs: [
      {
        id: "job-1b",
        name: "Build & Lint",
        status: "failure",
        steps: [
          {
            id: "s1",
            name: "Checkout",
            status: "success",
            duration: "1s",
            logs: [],
          },
          {
            id: "s2",
            name: "Lint",
            status: "failure",
            duration: "5s",
            logs: [
              "Error: Unused variable 'x' in Login.tsx:42",
              "Process exited with code 1",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "run-103",
    name: "Nightly Security Scan",
    commitMsg: "Scheduled Run",
    branch: "main",
    user: "system",
    status: "in_progress",
    startTime: "Just now",
    duration: "12s",
    jobs: [
      {
        id: "job-1c",
        name: "Vulnerability Scan",
        status: "running",
        steps: [
          {
            id: "s1",
            name: "Init Scanner",
            status: "success",
            duration: "2s",
            logs: ["Scanner initialized"],
          },
          {
            id: "s2",
            name: "Scan Metadata",
            status: "running",
            duration: "10s",
            logs: ["Scanning package.json...", "Scanning dockerfile..."],
          },
        ],
      },
    ],
  },
];
