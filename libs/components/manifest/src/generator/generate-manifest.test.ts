const projectsRootDirectory =
  'libs/components/manifest/src/generator/testing/fixtures/example-packages';

function setup(options: { outDirExists: boolean }): {
  mkdirMock: jest.Mock;
  writeFileMock: jest.Mock;
} {
  jest.spyOn(process.stderr, 'write').mockReturnValue(true);

  const mkdirMock = jest.fn();
  const writeFileMock = jest.fn();

  jest.mock('node:fs', () => {
    return {
      existsSync: jest.fn().mockReturnValue(options.outDirExists),
    };
  });

  jest.mock('node:fs/promises', () => {
    return {
      mkdir: mkdirMock,
      writeFile: writeFileMock,
    };
  });

  jest.mock('./get-projects', () => {
    return {
      getProjects: jest.fn().mockImplementation(() => {
        const projectRoot = `${projectsRootDirectory}/foo`;

        return [
          {
            entryPoints: [
              `${projectRoot}/src/index.ts`,
              `${projectRoot}/testing/src/public-api.ts`,
            ],
            packageName: '@skyux/foo',
            projectName: 'foo',
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
      outDirExists: true,
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      outDir: '/dist',
      projectNames: ['foo'],
      projectsRootDirectory,
    });

    expect(writeFileMock).toMatchSnapshot();
  });

  it('should create the out directory if it does not exist', async () => {
    const { mkdirMock } = setup({
      outDirExists: false,
    });

    const { generateManifest } = await import('./generate-manifest');

    await generateManifest({
      outDir: '/dist',
      projectNames: ['foo'],
      projectsRootDirectory,
    });

    expect(mkdirMock).toHaveBeenCalledWith('/dist');
  });
});
