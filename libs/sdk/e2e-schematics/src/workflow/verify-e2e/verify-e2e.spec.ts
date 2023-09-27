import { verifyE2e } from './verify-e2e';

describe('verify-e2e', () => {
  function setupTest() {
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
      coreInfo: jest.fn(),
      coreSetFailed: jest.fn(),
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
    };
  }

  it('should pass', async () => {
    const {
      coreInfo,
      coreSetFailed,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = setupTest();
    await verifyE2e(
      ['project1'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
      },
      {
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      }
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should page', async () => {
    const {
      coreInfo,
      coreSetFailed,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = setupTest();
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
      },
      {
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      }
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(listCommitStatusesForRef).toHaveBeenCalledTimes(2);
    expect(listJobsForWorkflowRun).toHaveBeenCalledTimes(2);
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle "skip" project', async () => {
    const {
      coreInfo,
      coreSetFailed,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = setupTest();
    await verifyE2e(
      ['skip'],
      'owner',
      'repo',
      'headSha',
      'run_id',
      {
        info: coreInfo,
        setFailed: coreSetFailed,
      },
      {
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      }
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(listCommitStatusesForRef).not.toHaveBeenCalled();
    expect(listJobsForWorkflowRun).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('No E2E Visual Review to verify.');
  });

  it('should handle skipped job', async () => {
    const {
      coreInfo,
      coreSetFailed,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = setupTest();
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
      },
      {
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      }
    );
    expect(coreSetFailed).not.toHaveBeenCalled();
    expect(coreInfo).toHaveBeenCalledWith('⏭️ project1');
    expect(coreInfo).toHaveBeenCalledWith('E2E Visual Review passed!');
  });

  it('should handle non-success statuses', async () => {
    const {
      coreInfo,
      coreSetFailed,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = setupTest();
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
      },
      {
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      }
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
      coreInfo,
      coreSetFailed,
      listCommitStatusesForRef,
      listJobsForWorkflowRun,
    } = setupTest();
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
      },
      {
        listCommitStatusesForRef,
        listJobsForWorkflowRun,
      }
    );
    expect(coreSetFailed).toHaveBeenCalledWith(
      'E2E Visual Review not complete. Missing results for: project1'
    );
  });
});
