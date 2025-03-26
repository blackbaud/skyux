describe('get-project-definitions', () => {
  function setup(options: { testingEntryPointExists: boolean }): void {
    jest.mock('node:fs', () => {
      return {
        existsSync: jest.fn().mockImplementationOnce(() => {
          return options.testingEntryPointExists;
        }),
      };
    });
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should get project definitions', async () => {
    setup({ testingEntryPointExists: true });

    const { getProjectDefinitions } = await import('./get-project-definitions');

    expect(getProjectDefinitions('my/projects/', ['foo', 'bar'])).toEqual([
      {
        entryPoints: [
          'my/projects/foo/src/index.ts',
          'my/projects/foo/testing/src/public-api.ts',
        ],
        packageName: '@skyux/foo',
        projectName: 'foo',
        projectRoot: 'my/projects/foo',
      },
      {
        entryPoints: ['my/projects/bar/src/index.ts'],
        packageName: '@skyux/bar',
        projectName: 'bar',
        projectRoot: 'my/projects/bar',
      },
    ]);
  });

  it('should add a trailing slash to project directory if not provided', async () => {
    setup({ testingEntryPointExists: true });

    const { getProjectDefinitions } = await import('./get-project-definitions');

    expect(getProjectDefinitions('my/projects', ['foo'])).toEqual([
      {
        entryPoints: [
          'my/projects/foo/src/index.ts',
          'my/projects/foo/testing/src/public-api.ts',
        ],
        packageName: '@skyux/foo',
        projectName: 'foo',
        projectRoot: 'my/projects/foo',
      },
    ]);
  });

  it('should not include a testing entry point if it does not exist', async () => {
    setup({ testingEntryPointExists: false });

    const { getProjectDefinitions } = await import('./get-project-definitions');

    expect(getProjectDefinitions('my/projects', ['foo'])).toEqual([
      {
        entryPoints: ['my/projects/foo/src/index.ts'],
        packageName: '@skyux/foo',
        projectName: 'foo',
        projectRoot: 'my/projects/foo',
      },
    ]);
  });
});
