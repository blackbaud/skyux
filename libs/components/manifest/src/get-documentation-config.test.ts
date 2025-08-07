import type { SkyManifestDocumentationConfig } from './types/documentation-config';

describe('get-documentation-config', () => {
  function setup(options: {
    documentationConfig: SkyManifestDocumentationConfig;
  }): void {
    jest.mock(
      '../documentation-config.json',
      () => options.documentationConfig,
    );
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should return documentation config', async () => {
    const documentationConfig: SkyManifestDocumentationConfig = {
      packages: {
        '@skyux/foo': {
          groups: {
            group1: {
              development: {
                docsIds: ['FooModule'],
                primaryDocsId: 'FooModule',
              },
              testing: { docsIds: [] },
              codeExamples: { docsIds: [] },
            },
          },
        },
        '@skyux/bar': {
          groups: {
            group2: {
              development: {
                docsIds: ['BarService'],
                primaryDocsId: 'BarService',
              },
              testing: { docsIds: [] },
              codeExamples: { docsIds: [] },
            },
          },
        },
      },
    };

    setup({ documentationConfig });

    const { getDocumentationConfig } = await import(
      './get-documentation-config'
    );

    const result = getDocumentationConfig();

    expect(result).toEqual(documentationConfig);
  });
});
