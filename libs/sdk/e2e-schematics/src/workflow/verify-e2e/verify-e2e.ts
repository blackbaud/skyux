import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { Fetch, checkPercyBuild } from '../percy-api/percy-api';

interface WorkflowJob {
  name: string;
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
  buildIdFilesPath: string,
  core: Core,
  githubApi: {
    listJobsForWorkflowRun: () => Promise<WorkflowJob[]>;
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
    let jobs = await githubApi.listJobsForWorkflowRun();
    if (!jobs || jobs.length === 0) {
      // Retry.
      jobs = await new Promise((resolve) => setTimeout(resolve, 20)).then(() =>
        githubApi.listJobsForWorkflowRun(),
      );
    }
    // This job always runs, so check if any previous jobs failed and fail this job before doing any more work.
    if (!jobs || jobs.length === 0 || !allWorkflowJobsPassed(jobs)) {
      core.setFailed('E2E workflow failed.');
      return exit(1);
    }
    const e2eSteps = listPercyWorkflowSteps(jobs);
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
      const buildIdFile = join(
        buildIdFilesPath,
        `percy-build-${e2eStep.project}.txt`,
      );
      if (!existsSync(buildIdFile)) {
        reviewComplete = false;
        core.warning(`🚫 ${e2eStep.project} (missing percy build ID file)`);
        continue;
      }
      const buildId = readFileSync(buildIdFile, 'utf-8').trim();
      if (!buildId) {
        reviewComplete = false;
        core.warning(`🚫 ${e2eStep.project} (empty percy build ID file)`);
        continue;
      }

      const projectStatus = await checkPercyBuild(
        `skyux-${e2eStep.project}`,
        buildId,
        core,
        fetchClient,
      );
      if (projectStatus?.state !== 'finished' || !projectStatus?.approved) {
        reviewComplete = false;
      }
      if (
        !allowMissingScreenshots &&
        projectStatus?.removedSnapshots?.length > 0
      ) {
        missingScreenshots.push({
          project: e2eStep.project,
          removedSnapshots: projectStatus.removedSnapshots,
        });
      }
      switch (true) {
        case !allowMissingScreenshots &&
          projectStatus?.removedSnapshots?.length > 0:
          icon = '❌';
          summary = `missing screenshots: ${projectStatus.removedSnapshots.join(
            ', ',
          )}`;
          break;
        case projectStatus?.state === 'finished' && projectStatus?.approved:
          icon = '✅';
          summary = 'approved';
          break;
        case projectStatus?.state === 'finished' && !projectStatus?.approved:
          icon = '⚠️';
          summary = 'needs approval';
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
          break;
        case typeof projectStatus?.state === 'undefined':
          icon = '🚫';
          summary = 'no Percy build found';
          break;
        default:
          icon = '❓';
          summary = `Percy state: "${projectStatus.state}"`;
      }
      core.info(`${icon} ${e2eStep.project} (${summary})`);
    }

    skippedPercyProjects.forEach((project) => core.info(`⏭️ ${project}`));
    const missingProjects = e2eProjects.filter(
      (project) =>
        !percyProjects.concat(skippedPercyProjects).includes(project),
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
        core.setFailed(`E2E Visual Review not complete.`);
        return exit(1);
      } else {
        core.info('E2E Visual Review passed!');
      }
    } else {
      // We don't have a check from Percy for all E2E projects.
      missingProjects.sort((a, b) => a.localeCompare(b));
      core.setFailed(
        `E2E Visual Review not complete. Missing results for:\n - ${missingProjects.join(
          `\n - `,
        )}`,
      );
      return exit(1);
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
}
