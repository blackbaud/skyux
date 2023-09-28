import { Fetch, checkPercyBuild } from '../percy-api/percy-api';

type WorkflowJob = { name: string; steps: WorkflowJobStep[] };
type WorkflowJobStep = { name: string; conclusion: string };
type WorkflowStepSummary = {
  project: string;
  skipped: boolean;
  succeeded: boolean;
};

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
 *     listJobsForWorkflowRun: github.rest.actions.listJobsForWorkflowRun
 *   },
 *   allowMissingScreenshots,
 *   percyFetchOptions,
 *   fetch,
 *   exit
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
    setOutput: (name: string, value: string) => void;
  },
  githubApi: {
    listJobsForWorkflowRun: (params: {
      owner: string;
      repo: string;
      run_id: string;
      per_page: number;
      page: number;
    }) => Promise<{ data: { jobs: WorkflowJob[] } }>;
  },
  allowMissingScreenshots: boolean,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
  /* istanbul ignore next */
  exit: (code?: number) => void = process.exit
): Promise<void> {
  if (e2eProjects.length > 0 && e2eProjects[0] !== 'skip') {
    // Verify that Percy has finished processing the E2E Visual Review and that all snapshots have passed.

    core.info('Fetching workflow jobs...');
    const e2eSteps = await listPercyWorkflowSteps();
    const e2eStepsThatWereRun = e2eSteps.filter((step) => !step.skipped);
    const percyProjects = e2eStepsThatWereRun.map((step) => step.project);
    const skippedPercyProjects = e2eSteps
      .filter((step) => step.skipped)
      .map((step) => step.project);

    // Log the status of each E2E Visual Review.
    core.info('E2E Visual Review results:');
    let reviewComplete = true;
    const missingScreenshots: {
      project: string;
      removedSnapshots: string[];
    }[] = [];
    for (const e2eStep of e2eStepsThatWereRun) {
      let icon: string;
      let summary: string;
      if (e2eStep.succeeded) {
        const projectStatus = await checkPercyBuild(
          `skyux-${e2eStep.project}`,
          headSha,
          fetchClient
        );
        if (projectStatus.state !== 'finished' || !projectStatus.approved) {
          reviewComplete = false;
        }
        if (
          !allowMissingScreenshots &&
          projectStatus.removedSnapshots.length > 0
        ) {
          missingScreenshots.push({
            project: e2eStep.project,
            removedSnapshots: projectStatus.removedSnapshots,
          });
        }
        switch (true) {
          case !allowMissingScreenshots &&
            projectStatus.removedSnapshots.length > 0:
            icon = '❌';
            summary = `missing screenshots: ${projectStatus.removedSnapshots.join(
              ', '
            )}`;
            break;
          case projectStatus.state === 'finished' && projectStatus.approved:
            icon = '✅';
            summary = 'approved';
            break;
          case projectStatus.state === 'finished' && !projectStatus.approved:
            icon = '⚠️';
            summary = 'needs approval';
            break;
          case projectStatus.state === 'waiting' ||
            projectStatus.state === 'pending' ||
            projectStatus.state === 'processing':
            icon = '⏳';
            summary = 'in progress';
            break;
          case projectStatus.state === 'failed':
            icon = '❌';
            summary = 'failed';
            break;
          default:
            icon = '❓';
            summary = `Percy state: "${projectStatus.state}"`;
        }
      } else {
        icon = '❓';
        summary = 'workflow step failed';
        reviewComplete = false;
      }
      core.info(`${icon} ${e2eStep.project} (${summary})`);
    }

    skippedPercyProjects.forEach((project) => core.info(`⏭️ ${project}`));
    const missingProjects = e2eProjects.filter(
      (project) => !percyProjects.concat(skippedPercyProjects).includes(project)
    );

    if (missingProjects.length === 0) {
      // We have a check from Percy for all E2E Visual Reviews.
      if (missingScreenshots.length > 0) {
        const instructions = `If this is intentional, add the 'screenshot removed' label to this PR and re-run the workflow.`;
        const missingScreenshotMessage = `Projects with missing screenshots:\n${missingScreenshots
          .map(
            (result) =>
              ` * ${result.project}\n${result.removedSnapshots
                .map((s) => `   - ${s}\n`)
                .join('')}`
          )
          .join(`\n`)}\n${instructions}`;
        const missingScreenshotMessageForSlack = `Projects with missing screenshots: ${missingScreenshots
          .map(
            (result) =>
              ` **${result.project}** (${result.removedSnapshots.join(', ')})`
          )
          .join(`; `)}. ${instructions}`;
        core.setOutput('missingScreenshots', missingScreenshotMessageForSlack);
        core.setFailed(missingScreenshotMessage);
        return exit(1);
      } else if (!reviewComplete) {
        core.setFailed(`E2E Visual Review not complete.`);
        return exit(1);
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
      return exit(1);
    }
  } else {
    core.info('No E2E Visual Review to verify.');
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
          succeeded: (step as WorkflowJobStep).conclusion === 'success',
        }))
    );
  }
}
