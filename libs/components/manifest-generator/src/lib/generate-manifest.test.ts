import { execSync } from 'node:child_process';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { readJsonFile } from 'nx/src/utils/fileutils.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { generateCodeExamplesManifest } from './generate-code-examples-manifest.js';
import { getProjectDefinitions } from './get-project-definitions.js';

vi.mock('node:child_process');
vi.mock('node:fs');
vi.mock('node:fs/promises', async (importOriginal) => {
  const original = await importOriginal<{
    default: typeof import('node:fs/promises');
  }>();

  return {
    default: {
      ...original.default,
      mkdir: vi.fn(),
      writeFile: vi.fn(),
    },
  };
});
vi.mock('nx/src/utils/fileutils.js');

vi.mock('./get-project-definitions.js');

const projectsRootDirectory =
  'libs/components/manifest-generator/src/testing/fixtures/example-packages';

function setup(options: {
  documentationJsonExists: boolean;
  outDirExists: boolean;
  projectNames: string[];
}): void {
  vi.spyOn(console, 'error').mockImplementation(() => {
    /* */
  });
  vi.spyOn(console, 'log').mockImplementation(() => {
    /* */
  });
  vi.spyOn(console, 'warn').mockImplementation(() => {
    /* */
  });

  vi.mocked(execSync).mockImplementation(() => 'CURRENT_BRANCH');

  vi.mocked(fs.existsSync).mockImplementation((filePath): boolean => {
    if ((filePath as string).startsWith('dist/')) {
      return options.outDirExists;
    }

    if ((filePath as string).endsWith('documentation.json')) {
      return options.documentationJsonExists;
    }

    return false;
  });

  vi.mocked(getProjectDefinitions).mockImplementation(() => {
    const definitions = [];

    for (const projectName of options.projectNames) {
      const projectRoot = `${projectsRootDirectory}/${projectName}`;

      definitions.push({
        entryPoints: [
          `${projectRoot}/src/index.ts`,
          `${projectRoot}/testing/src/public-api.ts`,
        ],
        packageName: `@skyux/${projectName}`,
        projectName,
        projectRoot,
      });
    }

    return definitions;
  });
}

describe('generate-manifest', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should generate manifest', async () => {
    const projectNames = ['code-examples', 'foo'];

    setup({
      documentationJsonExists: true,
      outDirExists: true,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest.js');

    await generateManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames,
      projectsRootDirectory,
    });

    expect(fsPromises.writeFile).toMatchSnapshot();
  }, 60000);

  it('should create the out directory if it does not exist', async () => {
    const projectNames = ['foo'];

    setup({
      documentationJsonExists: false,
      outDirExists: false,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest.js');

    await generateManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames,
      projectsRootDirectory,
    });

    expect(fsPromises.mkdir).toHaveBeenCalledWith('/dist');
  }, 60000);

  it('should throw for invalid docs IDs', async () => {
    const projectNames = ['invalid-docs-id'];

    setup({
      documentationJsonExists: false,
      outDirExists: true,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest.js');

    await expect(
      generateManifest({
        codeExamplesPackageName: '@skyux/code-examples',
        outDir: '/dist',
        projectNames,
        projectsRootDirectory,
      }),
    ).rejects.toThrow(
      'The following errors were encountered when creating the manifest:\n' +
        ' - Duplicate @docsId encountered: my-duplicate',
    );
  }, 60000);

  it('should throw for invalid documentation.json', async () => {
    const projectNames = ['code-examples', 'invalid-documentation-json'];

    setup({
      documentationJsonExists: true,
      outDirExists: true,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest.js');

    await expect(
      generateManifest({
        codeExamplesPackageName: '@skyux/code-examples',
        outDir: '/dist',
        projectNames,
        projectsRootDirectory,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  }, 60000);

  it('should throw when code example does not have a selector', async () => {
    const projectNames = ['invalid-code-examples'];

    setup({
      documentationJsonExists: true,
      outDirExists: true,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest.js');

    const { publicApi } = await generateManifest({
      codeExamplesPackageName: '@skyux/invalid-code-examples',
      outDir: '/dist',
      projectNames,
      projectsRootDirectory,
    });

    vi.mocked(readJsonFile).mockImplementation((filePath: string): object => {
      if (filePath.endsWith('public-api.json')) {
        return publicApi;
      }
      if (filePath.endsWith('documentation-config.json')) {
        return { packages: {} };
      }
      return {};
    });

    await expect(
      generateCodeExamplesManifest({
        codeExamplesPackageName: '@skyux/invalid-code-examples',
        outDir: '/dist',
        projectNames,
        projectsRootDirectory,
      }),
    ).rejects.toThrow(
      'The following errors were encountered when creating the code examples manifest:\n' +
        " - The code example 'FooCodeExampleNoSelector' must specify a selector.\n" +
        ' - The following code example docsIds are not being referenced within a documentation.json file. Either delete the code example, or add its docsId to a documentation.json file: "FooCodeExampleNoSelector"',
    );
  }, 60000);
});
