import fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs');

describe('get-project-definitions', () => {
  function setup(options: { testingEntryPointExists: boolean }): void {
    vi.mocked(fs.existsSync).mockImplementationOnce(
      () => options.testingEntryPointExists,
    );
  }

  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should get project definitions', async () => {
    setup({ testingEntryPointExists: true });

    const { getProjectDefinitions } =
      await import('./get-project-definitions.js');

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

    const { getProjectDefinitions } =
      await import('./get-project-definitions.js');

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

    const { getProjectDefinitions } =
      await import('./get-project-definitions.js');

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
