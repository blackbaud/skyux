import {
  checkPercyBuild,
  getLastGoodPercyBuild,
  getPercyTargetCommit,
} from './percy-api';

describe('percy-api', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should check build', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        if (url.endsWith('/removed-snapshots')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                data: [
                  {
                    type: 'snapshots',
                    id: 'snapshotId',
                    attributes: {
                      name: 'snapshotName',
                    },
                  },
                  {
                    type: 'snapshots',
                    id: 'anotherId',
                    attributes: {
                      name: 'anotherName',
                    },
                  },
                ],
              }),
          });
        }
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: 'buildId',
                  type: 'builds',
                  attributes: {
                    'review-state': 'approved',
                    state: 'finished',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await checkPercyBuild(
      'test-storybook-e2e',
      'commitSha',
      fetchClient,
    );
    expect(result).toEqual({
      approved: true,
      project: 'test-storybook-e2e',
      removedSnapshots: ['anotherName', 'snapshotName'],
      state: 'finished',
    });
  });

  it('should get last good build', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: 'buildId',
                  type: 'builds',
                  attributes: {
                    'review-state': 'approved',
                    state: 'finished',
                    'commit-html-url': 'https://.../commitSha',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await getLastGoodPercyBuild(
      'test-storybook-e2e',
      ['commitSha'],
      true,
      fetchClient,
    );
    expect(result).toEqual('commitSha');
  });

  it('should get target commit', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: 'buildId',
                  type: 'builds',
                  attributes: {
                    'review-state': 'approved',
                    state: 'finished',
                    'commit-html-url': 'https://.../commitSha',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await getPercyTargetCommit(
      'test-storybook-e2e',
      ['commitSha'],
      fetchClient,
    );
    expect(result).toEqual('commitSha');
  });

  it('should handle no matching target commit', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await getPercyTargetCommit(
      'test-storybook-e2e',
      ['commitSha'],
      fetchClient,
    );
    expect(result).toEqual('');
  });

  it('should handle errors with target commit', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.reject(new Error('Nope.'));
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    await expect(() =>
      getPercyTargetCommit('test-storybook-e2e', ['commitSha'], fetchClient),
    ).rejects.toThrowError(
      'Error checking Percy: Error: Error fetching Percy project ID',
    );
  });

  it('should not return a build with missing screenshots', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        if (url.endsWith('/removed-snapshots')) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                data: [
                  {
                    type: 'snapshots',
                    id: 'snapshotId',
                    attributes: {
                      name: 'snapshotName',
                    },
                  },
                  {
                    type: 'snapshots',
                    id: 'anotherId',
                    attributes: {
                      name: 'anotherName',
                    },
                  },
                ],
              }),
          });
        }
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: 'buildId',
                  type: 'builds',
                  attributes: {
                    'review-state': 'approved',
                    state: 'finished',
                    'commit-html-url': 'https://.../commitSha',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await getLastGoodPercyBuild(
      'test-storybook-e2e',
      ['commitSha'],
      false,
      fetchClient,
    );
    expect(result).toEqual('');
  });

  it('should handle no good builds', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await getLastGoodPercyBuild(
      'test-storybook-e2e',
      ['commitSha'],
      true,
      fetchClient,
    );
    expect(result).toEqual('');
  });

  it('should handle no matching build', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await checkPercyBuild(
      'test-storybook-e2e',
      'commitSha',
      fetchClient,
    );
    expect(result).toEqual({
      approved: false,
      project: 'test-storybook-e2e',
      removedSnapshots: [],
      state: undefined,
    });
  });

  it('should handle no matching project', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: {} }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    await expect(
      checkPercyBuild('test-storybook-e2e', 'commitSha', fetchClient),
    ).rejects.toThrowError(
      'Error checking Percy build: Percy project ID response for test-storybook-e2e: {}',
    );
  });

  it('should handle unfinished build', async () => {
    const fetchClient = jest.fn().mockImplementation((url: string) => {
      if (url.startsWith('https://percy.io/api/v1/projects')) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: { id: 'projectId' } }),
        });
      }
      if (url.startsWith('https://percy.io/api/v1/builds')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: [
                {
                  id: 'buildId',
                  type: 'builds',
                  attributes: {
                    'review-state': 'approved',
                    state: 'pending',
                    'commit-html-url': 'https://.../commitSha',
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    const result = await checkPercyBuild(
      'test-storybook-e2e',
      'commitSha',
      fetchClient,
    );
    expect(result).toEqual({
      approved: false,
      project: 'test-storybook-e2e',
      removedSnapshots: [],
      state: 'pending',
    });
  });

  it('should handle exception', async () => {
    const fetchClient = jest.fn().mockImplementation(() => {
      throw new Error('Nope.');
    });
    await expect(
      checkPercyBuild('test-storybook-e2e', 'commitSha', fetchClient),
    ).rejects.toThrowError('Error checking Percy build: Error: Nope.');
    await expect(
      getLastGoodPercyBuild(
        'test-storybook-e2e',
        ['commitSha'],
        true,
        fetchClient,
      ),
    ).rejects.toThrowError('Error checking Percy: Error: Nope.');
  });

  it('should handle rejection', async () => {
    const fetchClient = jest
      .fn()
      .mockImplementation(() => Promise.reject('Nope.'));
    await expect(
      checkPercyBuild('test-storybook-e2e', 'commitSha', fetchClient),
    ).rejects.toThrowError(
      'Error checking Percy build: Error: Error fetching Percy project ID',
    );
  });

  it('should handle response without data', async () => {
    const fetchClient = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ json: () => Promise.resolve({}) }),
      );
    await expect(
      checkPercyBuild('test-storybook-e2e', 'commitSha', fetchClient),
    ).rejects.toThrowError(
      'Error checking Percy build: Error: Error fetching Percy project ID',
    );
  });
});
