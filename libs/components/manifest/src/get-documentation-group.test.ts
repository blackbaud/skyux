import { afterEach, describe, expect, it, vi } from 'vitest';

import { SkyManifestParentDefinition } from './types/base-def.js';
import { SkyManifestDocumentationConfig } from './types/documentation-config.js';
import {
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from './types/manifest.js';

const codeExamplesJson: SkyManifestCodeExamples = {
  examples: {},
};

const documentationConfigJson: SkyManifestDocumentationConfig = {
  packages: {},
};

const publicApiJson: SkyManifestPublicApi = {
  packages: {},
};

vi.mock('../code-examples.json', () => {
  return { default: codeExamplesJson };
});

vi.mock('../documentation-config.json', () => {
  return { default: documentationConfigJson };
});

vi.mock('../public-api.json', () => {
  return { default: publicApiJson };
});

describe('get-documentation-group', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();

    codeExamplesJson.examples = {};
    documentationConfigJson.packages = {};
    publicApiJson.packages = {};
  });

  it('should return information about a documentation group', async () => {
    codeExamplesJson.examples = {
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
    };

    documentationConfigJson.packages = {
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
    };

    publicApiJson.packages = {
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
    };

    const { getDocumentationGroup } = await import(
      './get-documentation-group.js'
    );

    const result = getDocumentationGroup('@skyux/core', 'foo');

    expect(result).toMatchSnapshot();
  });

  it('should throw if package name unrecognized', async () => {
    documentationConfigJson.packages = {};
    publicApiJson.packages = {};

    const { getDocumentationGroup } = await import(
      './get-documentation-group.js'
    );

    expect(() =>
      getDocumentationGroup('@skyux/invalid', 'foo'),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if group name unrecognized', async () => {
    documentationConfigJson.packages = {
      '@skyux/core': {
        groups: {},
      },
    };

    publicApiJson.packages = {};

    const { getDocumentationGroup } = await import(
      './get-documentation-group.js'
    );

    expect(() =>
      getDocumentationGroup('@skyux/core', 'invalid'),
    ).toThrowErrorMatchingSnapshot();
  });

  it('should throw if docsId unrecognized', async () => {
    documentationConfigJson.packages = {
      '@skyux/core': {
        groups: {
          foo: {
            docsIds: ['invalid'],
            primaryDocsId: 'invalid',
          },
        },
      },
    };

    publicApiJson.packages = {};

    const { getDocumentationGroup } = await import(
      './get-documentation-group.js'
    );

    expect(() =>
      getDocumentationGroup('@skyux/core', 'foo'),
    ).toThrowErrorMatchingSnapshot();
  });
});
