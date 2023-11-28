import { BuildSummary } from '../percy-api/percy-api';

describe('verify-e2e', () => {
  async function setupTest() {
    const checkPercyBuild: jest.Mock<Promise<BuildSummary>> = jest
      .fn()
      .mockResolvedValue({
        project: 'project1',
        approved: true,
        removedSnapshots: [],
        state: 'finished',
      });
    jest.mock('../percy-api/percy-api', () => ({
      checkPercyBuild,
    }));
    const { verifyE2e } = await import('./verify-e2e');
    const jobs = [
      {
        name: 'End to end tests (project1)',
        steps: [
          {
            name: 'Percy project1',
            conclusion: 'success',
          },
        ],
      },
    ];
    return {
      checkPercyBuild,
      verifyE2e,
      coreInfo: jest.fn(),
      coreSetFailed: jest.fn(),
      coreSetOutput: jest.fn(),
      fetch: jest.fn(),
      jobs,
      listJobsForWorkflowRun: jest.fn().mockReturnValue({
        data: {
          jobs,
        },
      }),
      exit: jest.fn(),
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should pass', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      fetch,
      listJobsForWorkflowRun,
    } = await setupTest();
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch,
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should page', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
    } = await setupTest();
    listJobsForWorkflowRun.mockImplementation(({ page }) => {
      if (page === 1) {
        return {
          data: {
            jobs: Array.from(Array(100).keys()).map((i) => ({
              name: `End to end tests (project${i + 1})`,
              steps: [
                {
                  name: `Percy project${i + 1}`,
                  conclusion: 'success',
                },
              ],
            })),
          },
        };
      }
      return { data: { jobs: [] } };
    });
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch,
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(listJobsForWorkflowRun).toHaveBeenCalledTimes(2);
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle "skip" project', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
    } = await setupTest();
    await verifyE2e(
      ['skip'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch,
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(listJobsForWorkflowRun).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('No E2E Visual Review to verify.');
  });

  it('should handle skipped job', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
    } = await setupTest();
    listJobsForWorkflowRun.mockReturnValue({
      data: {
        jobs: [
          {
            name: 'End to end tests (project1)',
            steps: [
              {
                name: 'Percy project1',
                conclusion: 'skipped',
              },
            ],
          },
        ],
      },
    });
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch,
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('⏭️ project1');
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle missing job', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    listJobsForWorkflowRun.mockReturnValue({
      data: {
        jobs: [
          {
            name: 'End to end tests (project1)',
            steps: [
              {
                name: 'Percy project1',
                conclusion: 'skipped',
              },
            ],
          },
        ],
      },
    });
    await verifyE2e(
      ['project1', 'project2'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(coreSetFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete. Missing results for: project2`,
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should handle failed job', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    listJobsForWorkflowRun.mockReturnValue({
      data: {
        jobs: [
          {
            name: 'End to end tests (project1)',
            steps: [
              {
                name: 'Percy project1',
                conclusion: 'failed',
              },
            ],
          },
        ],
      },
    });
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(coreSetFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should check for missing screenshots', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      false, // allowMissingScreenshots
      fetch,
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should fail for missing screenshots', async () => {
    const {
      checkPercyBuild,
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    const e2eProjects = [
      'project-finished',
      'project-waiting',
      'project-pending',
      'project-processing',
      'project-failed',
      'project-missing',
      'project-other',
    ];
    checkPercyBuild.mockImplementation((...args: any) =>
      Promise.resolve({
        project: `${args[0]}`,
        approved: false,
        removedSnapshots: `${args[0]}`.match(/-missing$/)
          ? ['removed-snapshot']
          : ([] as string[]),
        state: `${args[0]}`.replace(/^skyux-project-/, ''),
      } as BuildSummary),
    );
    listJobsForWorkflowRun.mockReturnValue({
      data: {
        jobs: e2eProjects.map((project) => ({
          name: `End to end tests (${project})`,
          steps: [
            {
              name: `Percy ${project}`,
              conclusion: 'success',
            },
          ],
        })),
      },
    });
    await verifyE2e(
      e2eProjects,
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(coreInfo).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(coreSetFailed).toHaveBeenCalled();
    expect(coreSetFailed.mock.lastCall[0]).toMatchInlineSnapshot(`
      "Projects with missing screenshots:
       * project-missing
         - removed-snapshot

      If this is intentional, add the 'screenshot removed' label to this PR and re-run the workflow."
    `);
  });

  it('should fail for unapproved screenshots', async () => {
    const {
      checkPercyBuild,
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    checkPercyBuild.mockResolvedValue({
      project: 'project1',
      approved: false,
      removedSnapshots: [],
      state: 'finished',
    });
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
        setOutput: coreSetOutput,
      },
      {
        listJobsForWorkflowRun,
      },
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(coreInfo).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(coreSetFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
  });
});
