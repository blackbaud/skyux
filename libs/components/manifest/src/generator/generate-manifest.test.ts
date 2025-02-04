import path from 'node:path';

const projectsRootDirectory =
  'libs/components/manifest/src/generator/testing/fixtures/example-packages';

function setup(options: {
  documentationJsonExists: boolean;
  outDirExists: boolean;
  projectName: 'foo' | 'invalid-docs-id' | 'invalid-documentation-json';
}): {
  mkdirMock: jest.Mock;
  writeFileMock: jest.Mock;
} {
  jest.spyOn(console, 'log').mockReturnValue(undefined);
  jest.spyOn(console, 'warn').mockReturnValue(undefined);

  const mkdirMock = jest.fn();
  const writeFileMock = jest.fn();

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
        const projectRoot = `${projectsRootDirectory}/${options.projectName}`;

        return [
          {
            entryPoints: [
              `${projectRoot}/src/index.ts`,
              `${projectRoot}/testing/src/public-api.ts`,
            ],
            packageName: `@skyux/${options.projectName}`,
            projectName: options.projectName,
            projectRoot,
          },
        ];
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
    const { writeFileMock } = setup({
      documentationJsonExists: false,
      outDirExists: true,
      projectName: 'foo',
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      outDir: '/dist',
      projectNames: ['foo'],
      projectsRootDirectory,
    });

    expect(writeFileMock).toMatchSnapshot();
  }, 60000);

  it('should create the out directory if it does not exist', async () => {
    const { mkdirMock } = setup({
      documentationJsonExists: false,
      outDirExists: false,
      projectName: 'foo',
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      outDir: '/dist',
      projectNames: ['foo'],
      projectsRootDirectory,
    });

    expect(mkdirMock).toHaveBeenCalledWith('/dist');
  }, 60000);

  it('should throw for invalid docs IDs', async () => {
    setup({
      documentationJsonExists: false,
      outDirExists: true,
      projectName: 'invalid-docs-id',
    });

    const { generateManifest } = await import('./generate-manifest');

    await expect(
      generateManifest({
        outDir: '/dist',
        projectNames: ['invalid-docs-id'],
        projectsRootDirectory,
      }),
    ).rejects.toThrow('Duplicate @docsId encountered: my-duplicate');
  }, 60000);

  it('should throw for invalid documentation.json', async () => {
    setup({
      documentationJsonExists: true,
      outDirExists: true,
      projectName: 'invalid-documentation-json',
    });

    const { generateManifest } = await import('./generate-manifest');

    await expect(
      generateManifest({
        outDir: '/dist',
        projectNames: ['invalid-docs-id'],
        projectsRootDirectory,
      }),
    ).rejects
      .toThrow(`Encountered the following errors when generating documentation:
 - Schema validation failed for ${path.normalize('libs/components/manifest/src/generator/testing/fixtures/example-packages/invalid-documentation-json/documentation.json')}
 - The @docsId "FooInternalClass" referenced by "invalid" is not included in the public API.
 - The @docsId "Duplicate1" referenced by "invalid" is not recognized.
 - The @docsId "Duplicate1" referenced by "invalid" is not recognized.
 - The @docsId "Invalid2" referenced by "invalid" is not recognized.
 - The value for primaryDocsId ("ModuleNotListed") must be included in the docsIds array for group "invalid" (current: FooInternalClass, Duplicate1, Duplicate1, Invalid2).`);
  }, 60000);
});
