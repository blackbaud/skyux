import {
  SkyManifestDocumentationConfig,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import glob from 'fast-glob';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getDocumentationConfig } from './get-documentation-config.js';
import { getPublicApi } from './get-public-api.js';

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
      readFile: vi.fn(),
    },
  };
});

vi.mock('nx/src/utils/fileutils.js');
vi.mock('fast-glob');
vi.mock('./get-documentation-config.js');
vi.mock('./get-project-definitions.js');
vi.mock('./get-public-api.js');

const projectsRootDirectory =
  'libs/components/manifest-generator/src/testing/fixtures/example-packages';

function setup(options: {
  outDirExists: boolean;
  publicApiJson: unknown;
  documentationConfigJson: unknown;
  codeExampleFiles?: Record<string, string>;
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

  vi.mocked(fs.existsSync).mockImplementation((filePath): boolean => {
    if ((filePath as string).startsWith('dist/')) {
      return options.outDirExists;
    }

    return false;
  });

  vi.mocked(getDocumentationConfig).mockImplementation(
    (): Promise<[SkyManifestDocumentationConfig, string[]]> => {
      return Promise.resolve([options.documentationConfigJson, []] as [
        SkyManifestDocumentationConfig,
        string[],
      ]);
    },
  );
  vi.mocked(getPublicApi).mockImplementation(
    (): Promise<[SkyManifestPublicApi, string[]]> => {
      return Promise.resolve([options.publicApiJson, []] as [
        SkyManifestPublicApi,
        string[],
      ]);
    },
  );

  // Mock glob to return file paths
  // eslint-disable-next-line @typescript-eslint/require-await
  vi.mocked(glob).mockImplementation(async (): Promise<string[]> => {
    if (options.codeExampleFiles) {
      return Object.keys(options.codeExampleFiles);
    }
    return [];
  });

  // Mock glob.convertPathToPattern
  (
    vi.mocked(glob) as unknown as typeof glob & {
      convertPathToPattern: (path: string) => string;
    }
  ).convertPathToPattern = (path: string): string => path;

  // Mock readFile to return file contents
  vi.mocked(fsPromises.readFile).mockImplementation(
    // eslint-disable-next-line @typescript-eslint/require-await
    async (filePath): Promise<string> => {
      const filePathStr = filePath.toString();
      if (options.codeExampleFiles && filePathStr in options.codeExampleFiles) {
        return options.codeExampleFiles[filePathStr];
      }
      return '';
    },
  );
}

describe('generate-code-examples-manifest', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should generate code examples manifest', async () => {
    const exampleFilePath =
      'libs/components/manifest-generator/src/testing/fixtures/example-packages/code-examples/src/lib/types.ts';
    const publicApiJson = {
      packages: {
        '@skyux/code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExample1',
            selector: 'foo-example-1',
            docsId: 'FooCodeExample1',
            filePath: exampleFilePath,
          },
        ],
      },
    };

    const documentationConfigJson = {
      packages: {
        '@skyux/code-examples': {
          groups: {
            'first-group': {
              codeExamples: {
                docsIds: ['FooCodeExample1'],
              },
            },
          },
        },
      },
    };

    setup({
      outDirExists: true,
      publicApiJson,
      documentationConfigJson,
      codeExampleFiles: {
        [exampleFilePath]: `import { Component } from '@angular/core';

@Component({
  selector: 'foo-example-1',
})
export class FooCodeExample1 {}`,
      },
    });

    const { generateCodeExamplesManifest } =
      await import('./generate-code-examples-manifest.js');

    await generateCodeExamplesManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames: ['code-examples'],
      projectsRootDirectory,
    });

    expect(fsPromises.writeFile).toHaveBeenCalledWith(
      '/dist/code-examples.json',
      expect.stringContaining('FooCodeExample1'),
    );
  }, 60000);

  it('should create the out directory if it does not exist', async () => {
    const publicApiJson = {
      packages: {
        '@skyux/code-examples': [],
      },
    };

    const documentationConfigJson = {
      packages: {
        '@skyux/code-examples': {
          codeExamples: [],
        },
      },
    };

    setup({
      outDirExists: false,
      publicApiJson,
      documentationConfigJson,
    });

    const { generateCodeExamplesManifest } =
      await import('./generate-code-examples-manifest.js');

    await generateCodeExamplesManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames: ['code-examples'],
      projectsRootDirectory,
    });

    expect(fsPromises.mkdir).toHaveBeenCalledWith('/dist');
  }, 60000);

  it('should throw when code example does not have a selector', async () => {
    const exampleFilePath =
      'libs/components/manifest-generator/src/testing/fixtures/example-packages/invalid-code-examples/src/lib/types.ts';
    const publicApiJson = {
      packages: {
        '@skyux/invalid-code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExampleNoSelector',
            docsId: 'FooCodeExampleNoSelector',
            filePath: exampleFilePath,
          },
        ],
      },
    };

    const documentationConfigJson = {
      packages: {
        '@skyux/invalid-code-examples': {
          groups: {
            'first-group': {
              codeExamples: {
                docsIds: ['FooCodeExampleNoSelector'],
              },
            },
          },
        },
      },
    };

    setup({
      outDirExists: true,
      publicApiJson,
      documentationConfigJson,
      codeExampleFiles: {
        [exampleFilePath]: `import { Component } from '@angular/core';

@Component({
  // missing a selector
})
export class FooCodeExampleNoSelector {}`,
      },
    });

    const { generateCodeExamplesManifest } =
      await import('./generate-code-examples-manifest.js');

    await expect(
      generateCodeExamplesManifest({
        codeExamplesPackageName: '@skyux/invalid-code-examples',
        outDir: '/dist',
        projectNames: ['invalid-code-examples'],
        projectsRootDirectory,
      }),
    ).rejects.toThrow(
      'The following errors were encountered when creating the code examples manifest:\n' +
        " - The code example 'FooCodeExampleNoSelector' must specify a selector.",
    );
  }, 60000);

  it('should handle null public API for code examples package', async () => {
    const publicApiJson = {
      packages: {
        // Code examples package is not present
      },
    };

    const documentationConfigJson = {
      packages: {
        '@skyux/code-examples': {
          groups: {
            'first-group': {
              codeExamples: {
                docsIds: [],
              },
            },
          },
        },
      },
    };

    setup({
      outDirExists: true,
      publicApiJson,
      documentationConfigJson,
    });

    const { generateCodeExamplesManifest } =
      await import('./generate-code-examples-manifest.js');

    await generateCodeExamplesManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames: ['code-examples'],
      projectsRootDirectory,
    });

    expect(fsPromises.writeFile).toHaveBeenCalledWith(
      '/dist/code-examples.json',
      expect.stringContaining('"examples": {}'),
    );
  }, 60000);

  it('should handle extraTags for docsDemoHidden and title', async () => {
    const exampleFilePath1 =
      'libs/components/manifest-generator/src/testing/fixtures/example-packages/code-examples/src/lib/example1.ts';
    const exampleFilePath2 =
      'libs/components/manifest-generator/src/testing/fixtures/example-packages/code-examples/src/lib/example2.ts';

    const publicApiJson = {
      packages: {
        '@skyux/code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExampleWithTitle',
            selector: 'foo-example-with-title',
            docsId: 'FooCodeExampleWithTitle',
            filePath: exampleFilePath1,
            extraTags: {
              title: 'Example with Custom Title',
            },
          },
          {
            kind: 'component',
            name: 'FooCodeExampleHiddenDemo',
            selector: 'foo-example-hidden-demo',
            docsId: 'FooCodeExampleHiddenDemo',
            filePath: exampleFilePath2,
            extraTags: {
              title: 'Example with Hidden Demo',
              docsDemoHidden: '',
            },
          },
        ],
      },
    };

    const documentationConfigJson = {
      packages: {
        '@skyux/code-examples': {
          groups: {
            'first-group': {
              codeExamples: {
                docsIds: [
                  'FooCodeExampleWithTitle',
                  'FooCodeExampleHiddenDemo',
                ],
                primaryDocsId: 'FooCodeExampleWithTitle',
              },
            },
          },
        },
      },
    };

    setup({
      outDirExists: true,
      publicApiJson,
      documentationConfigJson,
      codeExampleFiles: {
        [exampleFilePath1]: `import { Component } from '@angular/core';

@Component({
  selector: 'foo-example-with-title',
})
export class FooCodeExampleWithTitle {}`,
        [exampleFilePath2]: `import { Component } from '@angular/core';

@Component({
  selector: 'foo-example-hidden-demo',
})
export class FooCodeExampleHiddenDemo {}`,
      },
    });

    const { generateCodeExamplesManifest } =
      await import('./generate-code-examples-manifest.js');

    await generateCodeExamplesManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames: ['code-examples'],
      projectsRootDirectory,
    });

    expect(fsPromises.writeFile).toHaveBeenCalledTimes(1);
    const writeCall = vi.mocked(fsPromises.writeFile).mock.calls[0];
    const manifestContent = JSON.parse(writeCall[1] as string);

    // Verify the example with title
    expect(manifestContent.examples.FooCodeExampleWithTitle).toEqual({
      componentName: 'FooCodeExampleWithTitle',
      files: {
        'example1.ts': expect.any(String),
        'example2.ts': expect.any(String),
      },
      importPath: '@skyux/code-examples',
      primaryFile: 'example1.ts',
      selector: 'foo-example-with-title',
      title: 'Example with Custom Title',
    });

    // Verify the example with hidden demo
    expect(manifestContent.examples.FooCodeExampleHiddenDemo).toEqual({
      componentName: 'FooCodeExampleHiddenDemo',
      demoHidden: true,
      files: {
        'example1.ts': expect.any(String),
        'example2.ts': expect.any(String),
      },
      importPath: '@skyux/code-examples',
      primaryFile: 'example2.ts',
      selector: 'foo-example-hidden-demo',
      title: 'Example with Hidden Demo',
    });
  }, 60000);
});
