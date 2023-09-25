type Status = { context: string; state: string };
type WorkflowJob = { name: string; steps: WorkflowJobStep[] };
type WorkflowJobStep = { name: string; conclusion: string };
type WorkflowStepSummary = { project: string; skipped: boolean };

/**
 * Call from GitHub Actions workflow:
 *
 * await verifyE2e(
 *   e2eProjects,
 *   context.repo.owner,
 *   context.repo.repo,
 *   '${{ needs.install-deps.outputs.head }}',
 *   '${{ github.run_id }}',
 *   core,
 *   {
 *     listCommitStatusesForRef: github.rest.repos.listCommitStatusesForRef,
 *     listJobsForWorkflowRun: github.rest.actions.listJobsForWorkflowRun
 *   }
 * );
 */
export async function verifyE2e(
  e2eProjects: string[],
  owner: string,
  repo: string,
  headSha: string,
  run_id: string,
  core: {
    info: (message: string) => void;
    setFailed: (message: string) => void;
  },
  githubApi: {
    listCommitStatusesForRef: (params: {
      owner: string;
      repo: string;
      ref: string;
      per_page: number;
      page: number;
    }) => Promise<{
      data: [Status];
    }>;
    listJobsForWorkflowRun: (params: {
      owner: string;
      repo: string;
      run_id: string;
      per_page: number;
      page: number;
    }) => Promise<{
      data: {
        jobs: WorkflowJob[];
      };
    }>;
  }
) {
  if (e2eProjects.length > 0 && e2eProjects[0] !== 'skip') {
    // Verify that Percy has finished processing the E2E Visual Review and that all snapshots have passed.

    core.info('Fetching commit statuses...');
    const latestPercyStatuses = await getLatestPercyStatuses();

    core.info('Fetching workflow jobs...');
    const skippedE2e = await listPercyWorkflowSteps().then((steps) =>
      steps.filter((step) => step.skipped).map((step) => step.project)
    );

    // Log the status of each E2E Visual Review.
    core.info('E2E Visual Review results:');
    latestPercyStatuses.forEach((status) => {
      let icon;
      switch (status.state) {
        case 'success':
          icon = '✅';
          break;
        case 'pending':
          icon = '⏳';
          break;
        case 'failure':
          icon = '❌';
          break;
        default:
          icon = '❓';
      }
      core.info(`${icon} ${status.context}`);
    });
    skippedE2e.forEach((project) => core.info(`⏭️ ${project}`));

    const percyProjects = latestPercyStatuses
      .map((status) => status.context.replace(/^percy\/skyux-/, ''))
      .concat(skippedE2e);
    const missingProjects = e2eProjects.filter(
      (project) => !percyProjects.includes(project)
    );

    if (missingProjects.length === 0) {
      // We have a check from Percy for all E2E Visual Reviews.
      if (latestPercyStatuses.some((status) => status.state !== 'success')) {
        core.setFailed(`E2E Visual Review not complete.`);
      } else {
        core.info('E2E Visual Review passed!');
      }
    } else {
      // We don't have a check from Percy for all E2E projects.
      core.setFailed(
        `E2E Visual Review not complete. Missing results for: ${missingProjects.join(
          ', '
        )}`
      );
    }
  } else {
    core.info('No E2E Visual Review to verify.');
  }

  async function listCommitStatusesForRef(page = 1) {
    const params = {
      owner,
      repo,
      ref: headSha,
      per_page: 100,
    };
    const { data } = await githubApi.listCommitStatusesForRef({
      page,
      ...params,
    });
    const statuses: any[] = [];
    statuses.push(...data);
    if (data.length === params.per_page) {
      statuses.push(...(await listCommitStatusesForRef(page + 1)));
    }
    return statuses;
  }

  async function getLatestPercyStatuses(): Promise<Status[]> {
    return await listCommitStatusesForRef().then((statuses) =>
      statuses
        .filter((status) => status.context.toLowerCase().startsWith('percy/'))
        .filter(
          (status, index, list) =>
            list.findIndex((s) => s.context === status.context) === index
        )
    );
  }

  async function listJobsForWorkflowRun(page = 1) {
    const params = {
      owner,
      repo,
      run_id,
      per_page: 100,
    };
    const { data } = await githubApi.listJobsForWorkflowRun({
      ...params,
      page,
    });
    const workflowE2eJobs: WorkflowJob[] = [];
    workflowE2eJobs.push(
      ...data.jobs.filter((job: WorkflowJob) =>
        job.name.startsWith('End to end tests')
      )
    );
    if (data.jobs.length === params.per_page) {
      workflowE2eJobs.push(...(await listJobsForWorkflowRun(page + 1)));
    }
    return workflowE2eJobs;
  }

  async function listPercyWorkflowSteps(): Promise<WorkflowStepSummary[]> {
    return await listJobsForWorkflowRun().then((workflowE2eJobs) =>
      workflowE2eJobs
        .filter((job) =>
          job.steps.some((step: WorkflowJobStep) =>
            step.name.startsWith('Percy')
          )
        )
        .map((job) =>
          job.steps.find((step: WorkflowJobStep) =>
            step.name.startsWith('Percy')
          )
        )
        .filter((step) => step)
        .map((step) => ({
          project: (step as WorkflowJobStep).name.replace(/^Percy /, ''),
          skipped: (step as WorkflowJobStep).conclusion === 'skipped',
        }))
    );
  }
}
