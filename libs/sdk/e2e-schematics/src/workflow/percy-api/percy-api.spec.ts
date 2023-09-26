import { checkPercyBuild, getLastGoodPercyBuild } from './percy-api';

describe('percy-api', () => {
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
      {},
      fetchClient
    );
    expect(result).toEqual({
      approved: true,
      project: 'test-storybook-e2e',
      removedSnapshots: ['anotherName', 'snapshotName'],
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
      {},
      fetchClient
    );
    expect(result).toEqual('commitSha');
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
      {},
      fetchClient
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
      {},
      fetchClient
    );
    expect(result).toEqual({
      approved: false,
      project: 'test-storybook-e2e',
      removedSnapshots: [],
    });
  });

  it('should handle exception', async () => {
    const fetchClient = jest.fn().mockImplementation(() => {
      throw new Error('Nope.');
    });
    await expect(
      checkPercyBuild('test-storybook-e2e', 'commitSha', {}, fetchClient)
    ).rejects.toThrowError('Error checking Percy build: Error: Nope.');
    await expect(
      getLastGoodPercyBuild(
        'test-storybook-e2e',
        ['commitSha'],
        {},
        fetchClient
      )
    ).rejects.toThrowError('Error checking Percy: Error: Nope.');
  });

  it('should handle rejection', async () => {
    const fetchClient = jest
      .fn()
      .mockImplementation(() => Promise.reject('Nope.'));
    await expect(
      checkPercyBuild('test-storybook-e2e', 'commitSha', {}, fetchClient)
    ).rejects.toEqual(
      new Error(
        'Error checking Percy build: Error: Error fetching Percy project ID: Nope.'
      )
    );
  });
});
