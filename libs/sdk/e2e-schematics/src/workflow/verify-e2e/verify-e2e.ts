import { existsSync, readFileSync } from 'fs';

import { BuildSummary, Fetch, checkPercyBuild } from '../percy-api/percy-api';
import { readPercyBuildNumberFromLogString } from '../percy-api/read-build-number-from-logs';

interface WorkflowJob {
  id: string;
  name: string;
  conclusion: string;
  steps: WorkflowJobStep[];
}
interface WorkflowJobStep {
  name: string;
  conclusion: string;
}
interface WorkflowStepSummary {
  project: string;
  skipped: boolean;
  succeeded: boolean;
}

type Core = {
  debug: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  notice: (message: string) => void;
  info: (message: string) => void;
  setFailed: (message: string) => void;
  setOutput: (name: string, value: string) => void;
};

export type Logger = Pick<
  Core,
  'debug' | 'error' | 'info' | 'notice' | 'warning'
>;

/**
 * Call from GitHub Actions workflow:
 *
 * await verifyE2e(
 *   e2eProjects,
 *   '${{ runner.temp }}/percy-builds',
 *   core,
 *   {
 *     listJobsForWorkflowRun: github.rest.actions.listJobsForWorkflowRun
 *   },
 *   allowMissingScreenshots,
 *   (url) => fetch(url, options),
 *   (number) => process.exit(number)
 * );
 */
export async function verifyE2e(
  e2eProjects: string[],
  buildIdFiles: string[],
  core: Core,
  githubApi: {
    listJobsForWorkflowRun: () => Promise<WorkflowJob[][]>;
    downloadJobLogs: (job_id: string) => Promise<string>;
  },
  allowMissingScreenshots: boolean,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
  /* istanbul ignore next */
  exit: (code?: number) => void = process.exit,
): Promise<void> {
  if (e2eProjects.length > 0 && e2eProjects[0] !== 'skip') {
    // Verify that Percy has finished processing the E2E Visual Review and that all snapshots have passed.

    core.info('Fetching workflow jobs...');
    const jobs = await listJobsForWorkflowRun(githubApi);
    // This job always runs, so check if any previous jobs failed and fail this job before doing any more work.
    if (!jobs || jobs.length === 0 || !allWorkflowJobsPassed(jobs[0])) {
      core.setFailed('E2E workflow failed.');
      return exit(1);
    }
    const e2eSteps = listPercyWorkflowSteps(jobs[0]);
    const skippedPercyProjects = e2eSteps
      .filter((step) => step.skipped)
      .map((step) => step.project);

    // Some e2e projects may not have re-run in this workflow run, but we still want to verify them.
    const e2eProjectsToCheck = e2eProjects.filter(
      (project) =>
        !skippedPercyProjects.includes(project) ||
        buildIdFiles.some((file) =>
          file.endsWith(`/percy-build-${project}.txt`),
        ),
    );

    // Log the status of each E2E Visual Review.
    core.info('E2E Visual Review results:');
    let reviewComplete = true;
    let alertWorthy = false;
    const missingScreenshots: {
      project: string;
      removedSnapshots: string[];
    }[] = [];
    for (const e2eProject of e2eProjects) {
      let icon: string;
      let summary: string;
      const checkThis = e2eProjectsToCheck.includes(e2eProject);
      let projectStatus: Partial<BuildSummary> = {};
      if (checkThis) {
        const buildIdFile = buildIdFiles.find((file) =>
          file.endsWith(`/percy-build-${e2eProject}.txt`),
        );
        let buildId: string | undefined;
        if (!buildIdFile || !existsSync(buildIdFile)) {
          buildId = await readBuildIdFromLogs(
            e2eProject,
            jobs,
            githubApi.downloadJobLogs,
          );
        } else {
          buildId = readFileSync(buildIdFile, 'utf-8').trim();
        }
        if (!buildId) {
          reviewComplete = false;
          alertWorthy = true;
          core.warning(`🚫 ${e2eProject} (unable to retrieve percy build ID)`);
          continue;
        }

        projectStatus = await checkPercyBuild(
          `skyux-${e2eProject}`,
          buildId,
          core,
          fetchClient,
        );
      }
      if (
        checkThis &&
        (projectStatus?.state !== 'finished' || !projectStatus?.approved)
      ) {
        reviewComplete = false;
      }
      const removedSnapshots = projectStatus?.removedSnapshots ?? [];
      if (!allowMissingScreenshots && removedSnapshots.length > 0) {
        missingScreenshots.push({
          project: e2eProject,
          removedSnapshots,
        });
      }
      switch (true) {
        case !checkThis:
          icon = '🙈';
          summary = 'percy build not needed';
          break;
        case !allowMissingScreenshots && removedSnapshots.length > 0:
          icon = '❌';
          summary = `missing screenshots: ${removedSnapshots.join(', ')}`;
          break;
        case projectStatus?.state === 'finished' && projectStatus?.approved:
          icon = '✅';
          summary = 'approved';
          break;
        case projectStatus?.state === 'finished' && !projectStatus?.approved:
          icon = '⚠️';
          summary = 'needs approval';
          alertWorthy = true;
          break;
        case ['waiting', 'pending', 'processing'].includes(
          projectStatus?.state ?? '',
        ):
          icon = '⏳';
          summary = 'in progress';
          break;
        case projectStatus?.state === 'failed':
          icon = '❌';
          summary = 'failed';
          alertWorthy = true;
          break;
        case typeof projectStatus?.state === 'undefined':
          icon = '🚫';
          summary = 'no Percy build found';
          alertWorthy = true;
          break;
        default:
          icon = '❓';
          summary = `Percy state: "${projectStatus.state}"`;
          alertWorthy = true;
      }
      core.info(`${icon} ${e2eProject} (${summary})`);
    }

    if (missingScreenshots.length > 0) {
      const instructions = `If this is intentional, add the 'screenshot removed' label to this PR and re-run the workflow.`;
      const missingScreenshotMessage = `Projects with missing screenshots:\n${missingScreenshots
        .map(
          (result) =>
            ` * ${result.project}\n${result.removedSnapshots
              .map((s) => `   - ${s}\n`)
              .join('')}`,
        )
        .join(`\n`)}\n${instructions}`;
      const missingScreenshotMessageForSlack = `Projects with missing screenshots: ${missingScreenshots
        .map(
          (result) =>
            ` 👉 ${result.project} (${result.removedSnapshots.join(', ')})`,
        )
        .join(`; `)}. ${instructions}`;
      core.setOutput('missingScreenshots', missingScreenshotMessageForSlack);
      core.setFailed(missingScreenshotMessage);
      return exit(1);
    } else if (!reviewComplete) {
      core.setOutput('shouldAlertSlack', `${alertWorthy}`);
      core.setFailed(`E2E Visual Review not complete.`);
      return exit(1);
    } else {
      core.info('E2E Visual Review passed!');
    }
  } else {
    core.info('No E2E Visual Review to verify.');
  }

  function allWorkflowJobsPassed(jobs: WorkflowJob[]): boolean {
    let allJobsPassed = true;
    const stepFailed = (step: WorkflowJobStep): boolean =>
      !['skipped', 'success'].includes(step.conclusion);
    jobs
      // The job that calls this script.
      .filter((job) => job.name !== 'E2E Visual Review')
      .filter((job) => job.steps.some(stepFailed))
      .forEach((job) => {
        allJobsPassed = false;
        const failStep = job.steps.find(stepFailed);
        core.info(`${job.name}: ${failStep?.name} ${failStep?.conclusion}`);
      });
    return allJobsPassed;
  }

  function listE2eJobsForWorkflowRun(jobs: WorkflowJob[]): WorkflowJob[] {
    return jobs.filter((job: WorkflowJob) =>
      job.name.startsWith('End to end tests'),
    );
  }

  function listPercyWorkflowSteps(jobs: WorkflowJob[]): WorkflowStepSummary[] {
    const workflowE2eJobs = listE2eJobsForWorkflowRun(jobs);

    return workflowE2eJobs
      .filter((job) =>
        job.steps.some((step: WorkflowJobStep) =>
          step.name.startsWith('Percy'),
        ),
      )
      .map((job) =>
        job.steps.find((step: WorkflowJobStep) =>
          step.name.startsWith('Percy'),
        ),
      )
      .filter((step): step is WorkflowJobStep => !!step)
      .map((step) => ({
        project: step.name.replace(/^Percy /, ''),
        skipped: step.conclusion === 'skipped',
        succeeded: step.conclusion === 'success',
      }));
  }

  async function readBuildIdFromLogs(
    e2eProject: string,
    jobs: WorkflowJob[][],
    downloadJobLogs: (job_id: string) => Promise<string>,
  ): Promise<string | undefined> {
    const jobsForThisProject = jobs
      .flatMap((run) =>
        run.find((job) =>
          job.name.startsWith(`End to end tests (${e2eProject},`),
        ),
      )
      .filter(Boolean) as WorkflowJob[];
    for (const jobForThisProject of jobsForThisProject) {
      const step = jobForThisProject.steps.find((step) =>
        step.name.startsWith('Percy'),
      );
      if (step && step.conclusion === 'success') {
        const log = await downloadJobLogs(jobForThisProject.id);
        const buildId = readPercyBuildNumberFromLogString(log);
        if (buildId) {
          return buildId;
        }
      }
    }
    return undefined;
  }

  async function listJobsForWorkflowRun(githubApi: {
    listJobsForWorkflowRun: () => Promise<WorkflowJob[][]>;
  }): Promise<WorkflowJob[][]> {
    let jobs = await githubApi.listJobsForWorkflowRun();
    if (!jobs || jobs.length === 0 || jobs[0].length === 0) {
      // Retry.
      await new Promise((resolve) => setTimeout(resolve, 20));
      jobs = await githubApi.listJobsForWorkflowRun();
    }
    return jobs;
  }
}
