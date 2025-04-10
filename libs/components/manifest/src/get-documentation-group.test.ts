import { SkyManifestParentDefinition } from './types/base-def';
import { SkyManifestDocumentationConfig } from './types/documentation-config';
import {
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from './types/manifest';

describe('get-documentation-group', () => {
  function setup(options: {
    codeExamples: SkyManifestCodeExamples;
    documentationConfig: SkyManifestDocumentationConfig;
    publicApi: SkyManifestPublicApi;
  }): void {
    jest.mock('../code-examples.json', () => options.codeExamples);
    jest.mock(
      '../documentation-config.json',
      () => options.documentationConfig,
    );
    jest.mock('../public-api.json', () => options.publicApi);
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should return information about a documentation group', async () => {
    setup({
      codeExamples: {
        examples: {
          FooCodeExample: {
            componentName: 'FooCodeExample',
            files: {
              'example.component.ts': 'TS_CONTENTS',
              'example.component.html': 'HTML_CONTENTS',
            },
            importPath: '@skyux/code-examples',
            primaryFile: 'example.component.ts',
            selector: 'lib-foo',
          },
          IndicatorCodeExample: {
            componentName: 'IndicatorCodeExample',
            files: {
              'example.component.ts': 'TS_CONTENTS',
              'example.component.html': 'HTML_CONTENTS',
            },
            importPath: '@skyux/code-examples',
            primaryFile: 'example.component.ts',
            selector: 'lib-indicator',
          },
        },
      },
      documentationConfig: {
        packages: {
          '@skyux/core': {
            groups: {
              foo: {
                development: {
                  docsIds: ['FooComponent', 'IndicatorComponent'],
                  primaryDocsId: 'FooComponent',
                },
                testing: { docsIds: ['FooHarness'] },
                codeExamples: { docsIds: ['FooCodeExample'] },
              },
              bar: {
                development: {
                  docsIds: ['BarComponent'],
                  primaryDocsId: 'BarComponent',
                },
                testing: { docsIds: [] },
                codeExamples: { docsIds: [] },
              },
            },
          },
          '@skyux/indicators': {
            groups: {
              indicators: {
                development: {
                  docsIds: ['IndicatorComponent'],
                  primaryDocsId: 'IndicatorComponent',
                },
                testing: { docsIds: [] },
                codeExamples: { docsIds: ['IndicatorCodeExample'] },
              },
            },
          },
        },
      },
      publicApi: {
        packages: {
          '@skyux/code-examples': [
            {
              name: 'FooCodeExample',
              docsId: 'FooCodeExample',
              extraTags: {
                title: 'My code example',
              },
              repoUrl: 'https://repo.com/foo',
            },
            {
              name: 'IndicatorCodeExample',
              docsId: 'IndicatorCodeExample',
              repoUrl: 'https://repo.com/foo',
            },
          ] as SkyManifestParentDefinition[],
          '@skyux/core': [
            {
              name: 'FooComponent',
              docsId: 'FooComponent',
              repoUrl: 'https://repo.com/foo',
            },
            {
              name: 'BarComponent',
              docsId: 'BarComponent',
              repoUrl: 'https://repo.com/foo',
            },
          ] as SkyManifestParentDefinition[],
          '@skyux/core/testing': [
            {
              name: 'FooHarness',
              docsId: 'FooHarness',
              repoUrl: 'https://repo.com/foo',
            },
          ] as SkyManifestParentDefinition[],
          '@skyux/indicators': [
            {
              name: 'IndicatorComponent',
              docsId: 'IndicatorComponent',
              repoUrl: 'https://repo.com/foo',
            },
            {
              name: 'IndicatorCodeExample',
              docsId: 'IndicatorCodeExample',
              repoUrl: 'https://repo.com/foo',
            },
          ] as SkyManifestParentDefinition[],
        },
      },
    });

    const { getDocumentationGroup } = await import('./get-documentation-group');

    const result = getDocumentationGroup('@skyux/core', 'foo');

    expect(result).toMatchSnapshot();
  });

  it('should throw if package name unrecognized', async () => {
    setup({
      codeExamples: {
        examples: {},
      },
      documentationConfig: {
        packages: {},
      },
      publicApi: {
        packages: {},
      },
    });

    const { getDocumentationGroup } = await import('./get-documentation-group');

    expect(() =>
      getDocumentationGroup('@skyux/invalid', 'foo'),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if group name unrecognized', async () => {
    setup({
      codeExamples: {
        examples: {},
      },
      documentationConfig: {
        packages: {
          '@skyux/core': {
            groups: {},
          },
        },
      },
      publicApi: {
        packages: {},
      },
    });

    const { getDocumentationGroup } = await import('./get-documentation-group');

    expect(() =>
      getDocumentationGroup('@skyux/core', 'invalid'),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if docsId unrecognized', async () => {
    setup({
      codeExamples: {
        examples: {},
      },
      documentationConfig: {
        packages: {
          '@skyux/core': {
            groups: {
              foo: {
                development: {
                  docsIds: ['invalid'],
                  primaryDocsId: 'invalid',
                },
                testing: { docsIds: [] },
                codeExamples: { docsIds: [] },
              },
            },
          },
        },
      },
      publicApi: {
        packages: {},
      },
    });

    const { getDocumentationGroup } = await import('./get-documentation-group');

    expect(() =>
      getDocumentationGroup('@skyux/core', 'foo'),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should remove internal parents and children', async () => {
    setup({
      codeExamples: {
        examples: {},
      },
      documentationConfig: {
        packages: {
          '@skyux/core': {
            groups: {
              foo: {
                development: {
                  docsIds: ['FooComponent', 'InternalComponent'],
                  primaryDocsId: 'FooComponent',
                },
                testing: { docsIds: [] },
                codeExamples: { docsIds: [] },
              },
            },
          },
        },
      },
      publicApi: {
        packages: {
          '@skyux/core': [
            {
              name: 'FooComponent',
              docsId: 'FooComponent',
              repoUrl: 'https://repo.com/foo',
              children: [
                {
                  name: 'internalProperty',
                  isInternal: true,
                },
                {
                  name: 'publicProperty',
                },
              ],
            },
            {
              name: 'InternalComponent',
              isInternal: true,
              docsId: 'InternalComponent',
              repoUrl: 'https://repo.com/foo',
            },
          ] as SkyManifestParentDefinition[],
        },
      },
    });

    const { getDocumentationGroup } = await import('./get-documentation-group');

    const result = getDocumentationGroup('@skyux/core', 'foo');

    expect(result).toMatchSnapshot();
  });
});
