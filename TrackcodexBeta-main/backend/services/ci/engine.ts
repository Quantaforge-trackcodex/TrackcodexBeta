export interface CIEngine {
  /**
   * Triggers a new CI execution.
   */
  createRun(options: {
    repoId: string;
    commitSha: string;
    branch: string;
    workflowId: string;
    env: Record<string, string>;
  }): Promise<{ externalId: string }>;

  /**
   * Cancels a running execution.
   */
  cancelRun(externalId: string): Promise<boolean>;

  /**
   * Gets list of artifacts for a run.
   */
  getArtifacts(
    externalId: string,
  ): Promise<Array<{ name: string; url: string }>>;

  /**
   * Stream logs for a specific job/step.
   */
  getLogs(externalId: string, jobId: string): Promise<NodeJS.ReadableStream>;
}
