const projectsRootDirectory =
  'libs/components/manifest/src/generator/testing/fixtures/example-packages';

function setup(options: {
  documentationJsonExists: boolean;
  outDirExists: boolean;
  projectNames: string[];
}): {
  mkdirMock: jest.Mock;
  writeFileMock: jest.Mock;
} {
  jest.spyOn(console, 'log').mockReturnValue(undefined);
  jest.spyOn(console, 'warn').mockReturnValue(undefined);

  const mkdirMock = jest.fn();
  const writeFileMock = jest.fn();

  jest.mock('node:child_process', () => {
    return {
      execSync: jest.fn().mockImplementation(() => {
        return 'CURRENT_BRANCH';
      }),
    };
  });

  jest.mock('node:fs', () => {
    return {
      existsSync: jest.fn().mockImplementation((filePath): boolean => {
        if (filePath.startsWith('dist/')) {
          return options.outDirExists;
        }

        if (filePath.endsWith('documentation.json')) {
          return options.documentationJsonExists;
        }

        return false;
      }),
    };
  });

  jest.mock('node:fs/promises', () => {
    const originalModule = jest.requireActual('node:fs/promises');

    return {
      ...originalModule,
      mkdir: mkdirMock,
      writeFile: writeFileMock,
    };
  });

  jest.mock('./get-project-definitions', () => {
    return {
      getProjectDefinitions: jest.fn().mockImplementation(() => {
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
      }),
    };
  });

  return { mkdirMock, writeFileMock };
}

describe('generate-manifest', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should generate manifest', async () => {
    const projectNames = ['code-examples', 'foo'];

    const { writeFileMock } = setup({
      documentationJsonExists: true,
      outDirExists: true,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames,
      projectsRootDirectory,
    });

    expect(writeFileMock).toMatchSnapshot();
  }, 60000);

  it('should create the out directory if it does not exist', async () => {
    const projectNames = ['foo'];

    const { mkdirMock } = setup({
      documentationJsonExists: false,
      outDirExists: false,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      codeExamplesPackageName: '@skyux/code-examples',
      outDir: '/dist',
      projectNames,
      projectsRootDirectory,
    });

    expect(mkdirMock).toHaveBeenCalledWith('/dist');
  }, 60000);

  it('should throw for invalid docs IDs', async () => {
    const projectNames = ['invalid-docs-id'];

    setup({
      documentationJsonExists: false,
      outDirExists: true,
      projectNames,
    });

    const { generateManifest } = await import('./generate-manifest');

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

    const { generateManifest } = await import('./generate-manifest');

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

    const { generateManifest } = await import('./generate-manifest');

    await expect(
      generateManifest({
        codeExamplesPackageName: '@skyux/invalid-code-examples',
        outDir: '/dist',
        projectNames,
        projectsRootDirectory,
      }),
    ).rejects
      .toThrow(`The following errors were encountered when creating the manifest:
 - The code example 'FooCodeExampleNoSelector' must specify a selector.`);
  }, 60000);
});
