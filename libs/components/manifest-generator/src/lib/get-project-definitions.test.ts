import fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs');

describe('get-project-definitions', () => {
  function setup(options: {
    testingEntryPointExists: boolean;
    prodTsConfigExists: boolean;
  }): void {
    vi.mocked(fs.existsSync).mockImplementation((filePath) =>
      (filePath as string).endsWith('tsconfig.lib.prod.json')
        ? options.prodTsConfigExists
        : options.testingEntryPointExists,
    );
  }

  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should get project definitions', async () => {
    setup({ testingEntryPointExists: true, prodTsConfigExists: true });

    const { getProjectDefinitions } =
      await import('./get-project-definitions.js');

    expect(
      getProjectDefinitions({
        packageScope: '@skyux',
        projectNames: ['foo', 'bar'],
        projectsRootDirectory: 'my/projects/',
      }),
    ).toEqual([
      {
        entryPoints: [
          'my/projects/foo/src/index.ts',
          'my/projects/foo/testing/src/public-api.ts',
        ],
        packageName: '@skyux/foo',
        projectName: 'foo',
        projectRoot: 'my/projects/foo',
        tsConfigPath: 'my/projects/foo/tsconfig.lib.prod.json',
      },
      {
        entryPoints: [
          'my/projects/bar/src/index.ts',
          'my/projects/bar/testing/src/public-api.ts',
        ],
        packageName: '@skyux/bar',
        projectName: 'bar',
        projectRoot: 'my/projects/bar',
        tsConfigPath: 'my/projects/bar/tsconfig.lib.prod.json',
      },
    ]);
  });

  it('should add a trailing slash to project directory if not provided', async () => {
    setup({ testingEntryPointExists: true, prodTsConfigExists: true });

    const { getProjectDefinitions } =
      await import('./get-project-definitions.js');

    expect(
      getProjectDefinitions({
        packageScope: '@skyux-sdk',
        projectNames: ['foo'],
        projectsRootDirectory: 'my/projects',
      }),
    ).toEqual([
      {
        entryPoints: [
          'my/projects/foo/src/index.ts',
          'my/projects/foo/testing/src/public-api.ts',
        ],
        packageName: '@skyux-sdk/foo',
        projectName: 'foo',
        projectRoot: 'my/projects/foo',
        tsConfigPath: 'my/projects/foo/tsconfig.lib.prod.json',
      },
    ]);
  });

  it('should not include a testing entry point if it does not exist', async () => {
    setup({ testingEntryPointExists: false, prodTsConfigExists: false });

    const { getProjectDefinitions } =
      await import('./get-project-definitions.js');

    expect(
      getProjectDefinitions({
        packageScope: '@skyux',
        projectNames: ['foo'],
        projectsRootDirectory: 'my/projects',
      }),
    ).toEqual([
      {
        entryPoints: ['my/projects/foo/src/index.ts'],
        packageName: '@skyux/foo',
        projectName: 'foo',
        projectRoot: 'my/projects/foo',
        tsConfigPath: 'my/projects/foo/tsconfig.lib.json',
      },
    ]);
  });
});
