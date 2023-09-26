describe('verify-e2e', () => {
  async function setupTest() {
    const checkPercyBuild = jest.fn().mockResolvedValue({
      project: 'project1',
      approved: true,
      removedSnapshots: [],
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
    const statuses = [
      {
        context: 'percy/skyux-project1',
        state: 'success',
      },
    ];
    return {
      checkPercyBuild,
      verifyE2e,
      coreInfo: jest.fn(),
      coreSetFailed: jest.fn(),
      coreSetOutput: jest.fn(),
      fetch: jest.fn(),
      statuses,
      listCommitStatusesForRef: jest.fn().mockReturnValue({
        data: statuses,
      }),
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
      listCommitStatusesForRef,
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch
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
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = await setupTest();
    listCommitStatusesForRef.mockImplementation(({ page }) => {
      if (page === 1) {
        return {
          data: Array.from(Array(100).keys()).map((i) => ({
            context: `percy/skyux-project${i + 1}`,
            state: 'success',
          })),
        };
      }
      return { data: [] };
    });
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(listCommitStatusesForRef).toHaveBeenCalledTimes(2);
    expect(listJobsForWorkflowRun).toHaveBeenCalledTimes(2);
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle "skip" project', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(listCommitStatusesForRef).not.toHaveBeenCalled();
    expect(listJobsForWorkflowRun).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('No E2E Visual Review to verify.');
  });

  it('should handle skipped job', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('⏭️ project1');
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle non-success statuses', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = await setupTest();
    listCommitStatusesForRef.mockReturnValue({
      data: [
        {
          context: 'percy/skyux-project1',
          state: 'failure',
        },
        {
          context: 'percy/skyux-project2',
          state: 'pending',
        },
        {
          context: 'percy/skyux-project3',
          state: 'other',
        },
      ],
    });
    await verifyE2e(
      ['project1', 'project2', 'project3'],
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch
    );
    expect(coreInfo).toHaveBeenCalledWith('❌ percy/skyux-project1');
    expect(coreInfo).toHaveBeenCalledWith('⏳ percy/skyux-project2');
    expect(coreInfo).toHaveBeenCalledWith('❓ percy/skyux-project3');
    expect(coreSetFailed).toHaveBeenCalledWith(
      'E2E Visual Review not complete.'
    );
  });

  it('should handle missing statuses', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = await setupTest();
    listCommitStatusesForRef.mockReturnValue({
      data: [],
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      true, // allowMissingScreenshots
      fetch
    );
    expect(coreSetFailed).toHaveBeenCalledWith(
      'E2E Visual Review not complete. Missing results for: project1'
    );
  });

  it('should check for missing screenshots', async () => {
    const {
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      false, // allowMissingScreenshots
      fetch
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should fail for missing screenshots', async () => {
    const {
      checkPercyBuild,
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    checkPercyBuild.mockResolvedValue({
      project: 'project1',
      approved: true,
      removedSnapshots: ['component/component1'],
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      false, // allowMissingScreenshots
      fetch,
      exit
    );
    expect(coreInfo).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(coreSetFailed).toHaveBeenCalledWith(
      'Projects with missing screenshots:\n' +
        ' * project1\n' +
        '   - component/component1\n'
    );
  });

  it('should fail for unapproved screenshots', async () => {
    const {
      checkPercyBuild,
      verifyE2e,
      coreInfo,
      coreSetFailed,
      coreSetOutput,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
      exit,
    } = await setupTest();
    checkPercyBuild.mockResolvedValue({
      project: 'project1',
      approved: false,
      removedSnapshots: [],
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
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      },
      false, // allowMissingScreenshots
      fetch,
      exit
    );
    expect(coreInfo).not.toHaveBeenCalledWith('E2E Visual Review passed!');
    expect(coreSetFailed).toHaveBeenCalledWith(
      `Projects not yet approved: project1`
    );
  });
});
