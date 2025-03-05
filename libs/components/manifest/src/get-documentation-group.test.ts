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
            componentName: 'FooComponent',
            files: {
              'foo.component.ts': 'TS_CONTENTS',
              'foo.component.html': 'HTML_CONTENTS',
            },
            importPath: '@skyux/foo',
            primaryFile: 'foo.component.ts',
            selector: 'lib-foo',
          },
          IndicatorCodeExample: {
            componentName: 'FooIndicatorComponent',
            files: {
              'indicator.component.ts': 'TS_CONTENTS',
              'indicator.component.html': 'HTML_CONTENTS',
            },
            importPath: '@skyux/foo-indicator',
            primaryFile: 'indicator.component.ts',
            selector: 'lib-indicator',
          },
        },
      },
      documentationConfig: {
        packages: {
          '@skyux/core': {
            groups: {
              foo: {
                docsIds: [
                  'FooComponent',
                  'FooHarness',
                  'IndicatorComponent',
                  'FooCodeExample',
                ],
                primaryDocsId: 'FooComponent',
              },
              bar: {
                docsIds: ['BarComponent'],
                primaryDocsId: 'BarComponent',
              },
            },
          },
          '@skyux/indicators': {
            groups: {
              indicators: {
                docsIds: ['IndicatorComponent', 'IndicatorCodeExample'],
                primaryDocsId: 'IndicatorComponent',
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
            },
            {
              name: 'IndicatorCodeExample',
              docsId: 'IndicatorCodeExample',
            },
          ] as SkyManifestParentDefinition[],
          '@skyux/core': [
            {
              name: 'FooComponent',
              docsId: 'FooComponent',
            },
            {
              name: 'FooCodeExample',
              docsId: 'FooCodeExample',
              extraTags: {
                title: 'This is my title',
              },
            },
            {
              name: 'BarComponent',
              docsId: 'BarComponent',
            },
          ] as SkyManifestParentDefinition[],
          '@skyux/core/testing': [
            {
              name: 'FooHarness',
              docsId: 'FooHarness',
            },
          ] as SkyManifestParentDefinition[],
          '@skyux/indicators': [
            {
              name: 'IndicatorComponent',
              docsId: 'IndicatorComponent',
            },
            {
              name: 'IndicatorCodeExample',
              docsId: 'IndicatorCodeExample',
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
                docsIds: ['invalid'],
                primaryDocsId: 'invalid',
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
});
