import { BuildSummary, Fetch } from '../percy-api/percy-api';

describe('verify-e2e', () => {
  async function setupTest(): Promise<{
    checkPercyBuild: jest.Mock;
    verifyE2e: (
      e2eProjects: string[],
      buildIdFiles: string[],
      core: any,
      githubApi: {
        listJobsForWorkflowRun: () => Promise<any[][]>;
        downloadJobLogs: () => Promise<string>;
      },
      allowMissingScreenshots: boolean,
      fetchClient: Fetch,
      exit?: (code?: number) => void,
    ) => Promise<void>;
    core: {
      debug: jest.Mock;
      error: jest.Mock;
      warning: jest.Mock;
      notice: jest.Mock;
      info: jest.Mock;
      setFailed: jest.Mock;
      setOutput: jest.Mock;
    };
    fetch: jest.Mock;
    fs: {
      existsSync: jest.Mock;
      readFileSync: jest.Mock;
    };
    jobs: {
      name: string;
      steps: {
        name: string;
        conclusion: string;
      }[];
    }[];
    githubApi: {
      listJobsForWorkflowRun: jest.Mock;
      downloadJobLogs: jest.Mock;
    };
    exit: jest.Mock;
  }> {
    const fs = {
      existsSync: jest.fn().mockReturnValue(true),
      readFileSync: jest.fn().mockReturnValue('3'),
    };
    jest.mock('fs', () => fs);

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
        name: 'End to end tests (project1,',
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
      core: {
        debug: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        notice: jest.fn(),
        info: jest.fn(),
        setFailed: jest.fn(),
        setOutput: jest.fn(),
      },
      fetch: jest.fn(),
      fs,
      jobs,
      githubApi: {
        listJobsForWorkflowRun: jest.fn().mockResolvedValue([jobs]),
        downloadJobLogs: jest.fn().mockResolvedValue(''),
      },
      exit: jest.fn(),
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should pass', async () => {
    const { verifyE2e, core, fetch, githubApi, exit } = await setupTest();
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle "skip" project', async () => {
    const { verifyE2e, core, githubApi } = await setupTest();
    await verifyE2e(
      ['skip'],
      [],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
    );
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(githubApi.listJobsForWorkflowRun).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith('No E2E Visual Review to verify.');
  });

  it('should handle skipped job', async () => {
    const { verifyE2e, checkPercyBuild, core, githubApi } = await setupTest();
    githubApi.listJobsForWorkflowRun
      .mockResolvedValueOnce(undefined)
      .mockResolvedValue([
        [
          {
            id: '123',
            name: 'End to end tests (project1,',
            steps: [
              {
                name: 'Percy project1',
                conclusion: 'skipped',
              },
            ],
          },
          {
            id: '456',
            name: 'End to end tests (project2,',
            steps: [
              {
                name: 'Percy project2',
                conclusion: 'skipped',
              },
            ],
          },
        ],
      ]);
    checkPercyBuild.mockResolvedValue({
      project: 'project2',
      approved: true,
      removedSnapshots: [],
      state: 'finished',
    });
    await verifyE2e(
      ['project1', 'project2'],
      ['/tmp/path/percy-build-project2.txt'],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      jest.fn(),
    );
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should retrieve build ID from logs', async () => {
    const { verifyE2e, checkPercyBuild, core, githubApi } = await setupTest();
    githubApi.listJobsForWorkflowRun.mockResolvedValue([
      [
        {
          id: '123',
          name: 'End to end tests (project1,',
          steps: [
            {
              name: 'Percy project1',
              conclusion: 'success',
            },
          ],
        },
        {
          id: '456',
          name: 'End to end tests (project2,',
          steps: [
            {
              name: 'Percy project2',
              conclusion: 'success',
            },
          ],
        },
      ],
    ]);
    githubApi.downloadJobLogs.mockResolvedValueOnce('').mockResolvedValueOnce(
      `
Some unrelated log output
Checking for finalized build: [percy] Finalized build #6134: https://percy.io/82a32315/web/skyux-integration-e2e/builds/41420284
More unrelated log output
`,
    );
    checkPercyBuild.mockResolvedValue({
      project: 'project2',
      approved: true,
      removedSnapshots: [],
      state: 'finished',
    });
    const exit = jest.fn();
    await verifyE2e(
      ['project1', 'project2'],
      [],
      core,
      githubApi,
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(exit).toHaveBeenCalledWith(1);
    expect(core.setFailed).toHaveBeenCalledWith(
      'E2E Visual Review not complete.',
    );
    expect(githubApi.downloadJobLogs).toHaveBeenCalledWith('123');
    expect(githubApi.downloadJobLogs).toHaveBeenCalledWith('456');
  });

  it('should handle missing job', async () => {
    const { verifyE2e, core, fs, githubApi, exit } = await setupTest();
    githubApi.listJobsForWorkflowRun.mockResolvedValue([
      [
        {
          name: 'End to end tests (project1,',
          steps: [
            {
              name: 'Percy project1',
              conclusion: 'skipped',
            },
          ],
        },
      ],
    ]);
    fs.existsSync.mockImplementation((path: string) => {
      return path === '/tmp/path/percy-build-project1.txt';
    });
    await verifyE2e(
      ['project1', 'project3', 'project2'],
      [],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.warning).toHaveBeenCalledWith(
      `🚫 project2 (unable to retrieve percy build ID)`,
    );
    expect(core.warning).toHaveBeenCalledWith(
      `🚫 project3 (unable to retrieve percy build ID)`,
    );
    expect(core.setFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should handle missing build', async () => {
    const { verifyE2e, fs, core, githubApi, checkPercyBuild, exit } =
      await setupTest();
    githubApi.listJobsForWorkflowRun.mockResolvedValue([
      [
        {
          name: 'End to end tests (project1,',
          steps: [
            {
              name: 'Percy project1',
              conclusion: 'success',
            },
          ],
        },
        {
          name: 'End to end tests (project2,',
          steps: [
            {
              name: 'Percy project2',
              conclusion: 'success',
            },
          ],
        },
      ],
    ]);
    checkPercyBuild.mockImplementation((project) =>
      Promise.resolve({
        project,
        state: undefined,
        approved: false,
        removedSnapshots: undefined,
      } as unknown as BuildSummary),
    );
    fs.existsSync.mockReturnValue(false);
    await verifyE2e(
      ['project1', 'project2'],
      [],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.warning).toHaveBeenCalledWith(
      `🚫 project1 (unable to retrieve percy build ID)`,
    );
    expect(core.warning).toHaveBeenCalledWith(
      `🚫 project2 (unable to retrieve percy build ID)`,
    );
    expect(core.setFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should handle failed job', async () => {
    const { verifyE2e, core, githubApi, exit } = await setupTest();
    githubApi.listJobsForWorkflowRun.mockResolvedValue([
      [
        {
          name: 'End to end tests (project1,',
          steps: [
            {
              name: 'Percy project1',
              conclusion: 'failed',
            },
          ],
        },
      ],
    ]);
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.setFailed).toHaveBeenCalledWith(`E2E workflow failed.`);
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should check for missing screenshots', async () => {
    const { verifyE2e, core, githubApi, exit } = await setupTest();
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      false, // allowMissingScreenshots
      fetch,
    );
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should fail for missing screenshots', async () => {
    const { checkPercyBuild, verifyE2e, core, githubApi, exit } =
      await setupTest();
    const e2eProjects = [
      'project-finished',
      'project-waiting',
      'project-pending',
      'project-processing',
      'project-failed',
      'project-missing',
      'project-other',
    ];
    checkPercyBuild.mockImplementation((...args) =>
      Promise.resolve({
        project: `${args[0]}`,
        approved: false,
        removedSnapshots: `${args[0]}`.match(/-missing$/)
          ? ['removed-snapshot']
          : ([] as string[]),
        state: `${args[0]}`.replace(/^skyux-project-/, ''),
      } as BuildSummary),
    );
    githubApi.listJobsForWorkflowRun.mockResolvedValue([
      e2eProjects.map((project) => ({
        name: `End to end tests (${project})`,
        steps: [
          {
            name: `Percy ${project}`,
            conclusion: 'success',
          },
        ],
      })),
    ]);
    await verifyE2e(
      e2eProjects,
      e2eProjects.map((project) => `/tmp/path/percy-build-${project}.txt`),
      core,
      githubApi,
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.info).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(core.setFailed).toHaveBeenCalled();
    expect(core.setFailed.mock.lastCall[0]).toMatchInlineSnapshot(`
      "Projects with missing screenshots:
       * project-missing
         - removed-snapshot

      If this is intentional, add the 'screenshot removed' label to this PR and re-run the workflow."
    `);
  });

  it('should fail for unapproved screenshots', async () => {
    const { checkPercyBuild, verifyE2e, core, githubApi, exit } =
      await setupTest();
    checkPercyBuild.mockResolvedValue({
      project: 'project1',
      approved: false,
      removedSnapshots: [],
      state: 'finished',
    });
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.info).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(core.setFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
  });

  it('should fail for missing build id file', async () => {
    const { checkPercyBuild, fs, verifyE2e, core, githubApi, exit } =
      await setupTest();
    fs.existsSync.mockReturnValue(false);
    await verifyE2e(
      ['project1'],
      [],
      core,
      githubApi,
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(checkPercyBuild).not.toHaveBeenCalled();
    expect(core.info).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(core.setFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
  });

  it('should fail for empty build id file', async () => {
    const { checkPercyBuild, fs, verifyE2e, core, githubApi, exit } =
      await setupTest();
    fs.readFileSync.mockReturnValue(`\n`);
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      false, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(checkPercyBuild).not.toHaveBeenCalled();
    expect(core.info).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(core.setFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
  });

  it('should handle failed GitHub API call', async () => {
    const { verifyE2e, core, githubApi, exit } = await setupTest();
    githubApi.listJobsForWorkflowRun.mockImplementation(() => {
      return Promise.resolve([]);
    });
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.setFailed).toHaveBeenCalledWith(`E2E workflow failed.`);
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('should handle failed Percy API call', async () => {
    const { verifyE2e, core, githubApi, checkPercyBuild, exit } =
      await setupTest();
    checkPercyBuild.mockImplementation(() => {
      return Promise.resolve({});
    });
    await verifyE2e(
      ['project1'],
      ['/tmp/path/percy-build-project1.txt'],
      core,
      githubApi,
      true, // allowMissingScreenshots
      fetch,
      exit,
    );
    expect(core.info).toHaveBeenCalledWith(
      `🚫 project1 (no Percy build found)`,
    );
    expect(core.setFailed).toHaveBeenCalledWith(
      `E2E Visual Review not complete.`,
    );
    expect(exit).toHaveBeenCalledWith(1);
  });
});
