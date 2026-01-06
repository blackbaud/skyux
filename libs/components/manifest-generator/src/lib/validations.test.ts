import type {
  SkyManifestDocumentationConfig,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import { describe, expect, it } from 'vitest';

import { validateCodeExamples } from './validations.js';

describe('validateCodeExamples', () => {
  it('should return no errors when all code examples are referenced', () => {
    const publicApi: SkyManifestPublicApi = {
      packages: {
        '@skyux/code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExample1',
            docsId: 'FooCodeExample1',
            anchorId: 'foo-code-example1',
            filePath: 'libs/code-examples/src/lib/example1.ts',
            repoUrl: 'https://github.com/example/repo',
          },
          {
            kind: 'component',
            name: 'FooCodeExample2',
            docsId: 'FooCodeExample2',
            anchorId: 'foo-code-example2',
            filePath: 'libs/code-examples/src/lib/example2.ts',
            repoUrl: 'https://github.com/example/repo',
          },
        ],
      },
    };

    const documentationConfig: SkyManifestDocumentationConfig = {
      packages: {
        '@skyux/foo': {
          groups: {
            'first-group': {
              development: {
                docsIds: ['FooComponent'],
                primaryDocsId: 'FooComponent',
              },
              testing: {
                docsIds: [],
              },
              codeExamples: {
                docsIds: ['FooCodeExample1', 'FooCodeExample2'],
              },
            },
          },
        },
      },
    };

    const errors = validateCodeExamples(
      publicApi,
      documentationConfig,
      '@skyux/code-examples',
    );

    expect(errors).toEqual([]);
  });

  it('should return error when code example docsId is not referenced', () => {
    const publicApi: SkyManifestPublicApi = {
      packages: {
        '@skyux/code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExample1',
            docsId: 'FooCodeExample1',
            anchorId: 'foo-code-example1',
            filePath: 'libs/code-examples/src/lib/example1.ts',
            repoUrl: 'https://github.com/example/repo',
          },
          {
            kind: 'component',
            name: 'FooCodeExample2',
            docsId: 'FooCodeExample2',
            anchorId: 'foo-code-example2',
            filePath: 'libs/code-examples/src/lib/example2.ts',
            repoUrl: 'https://github.com/example/repo',
          },
          {
            kind: 'component',
            name: 'UnreferencedCodeExample',
            docsId: 'UnreferencedCodeExample',
            anchorId: 'unreferenced-code-example',
            filePath: 'libs/code-examples/src/lib/unreferenced.ts',
            repoUrl: 'https://github.com/example/repo',
          },
        ],
      },
    };

    const documentationConfig: SkyManifestDocumentationConfig = {
      packages: {
        '@skyux/foo': {
          groups: {
            'first-group': {
              development: {
                docsIds: ['FooComponent'],
                primaryDocsId: 'FooComponent',
              },
              testing: {
                docsIds: [],
              },
              codeExamples: {
                docsIds: ['FooCodeExample1', 'FooCodeExample2'],
              },
            },
          },
        },
      },
    };

    const errors = validateCodeExamples(
      publicApi,
      documentationConfig,
      '@skyux/code-examples',
    );

    expect(errors).toEqual([
      'The following code example docsIds are not being referenced within a documentation.json file. Either delete the code example, or add its docsId to a documentation.json file: "UnreferencedCodeExample"',
    ]);
  });

  it('should return errors for multiple unreferenced code examples', () => {
    const publicApi: SkyManifestPublicApi = {
      packages: {
        '@skyux/code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExample1',
            docsId: 'FooCodeExample1',
            anchorId: 'foo-code-example1',
            filePath: 'libs/code-examples/src/lib/example1.ts',
            repoUrl: 'https://github.com/example/repo',
          },
          {
            kind: 'component',
            name: 'UnreferencedCodeExample1',
            docsId: 'UnreferencedCodeExample1',
            anchorId: 'unreferenced-code-example1',
            filePath: 'libs/code-examples/src/lib/unreferenced1.ts',
            repoUrl: 'https://github.com/example/repo',
          },
          {
            kind: 'component',
            name: 'UnreferencedCodeExample2',
            docsId: 'UnreferencedCodeExample2',
            anchorId: 'unreferenced-code-example2',
            filePath: 'libs/code-examples/src/lib/unreferenced2.ts',
            repoUrl: 'https://github.com/example/repo',
          },
        ],
      },
    };

    const documentationConfig: SkyManifestDocumentationConfig = {
      packages: {
        '@skyux/foo': {
          groups: {
            'first-group': {
              development: {
                docsIds: ['FooComponent'],
                primaryDocsId: 'FooComponent',
              },
              testing: {
                docsIds: [],
              },
              codeExamples: {
                docsIds: ['FooCodeExample1'],
              },
            },
          },
        },
      },
    };

    const errors = validateCodeExamples(
      publicApi,
      documentationConfig,
      '@skyux/code-examples',
    );

    expect(errors).toEqual([
      'The following code example docsIds are not being referenced within a documentation.json file. Either delete the code example, or add its docsId to a documentation.json file: "UnreferencedCodeExample1", "UnreferencedCodeExample2"',
    ]);
  });

  it('should handle code examples referenced in multiple groups', () => {
    const publicApi: SkyManifestPublicApi = {
      packages: {
        '@skyux/code-examples': [
          {
            kind: 'component',
            name: 'FooCodeExample1',
            docsId: 'FooCodeExample1',
            anchorId: 'foo-code-example1',
            filePath: 'libs/code-examples/src/lib/example1.ts',
            repoUrl: 'https://github.com/example/repo',
          },
        ],
      },
    };

    const documentationConfig: SkyManifestDocumentationConfig = {
      packages: {
        '@skyux/foo': {
          groups: {
            'first-group': {
              development: {
                docsIds: ['FooComponent'],
                primaryDocsId: 'FooComponent',
              },
              testing: {
                docsIds: [],
              },
              codeExamples: {
                docsIds: ['FooCodeExample1'],
              },
            },
            'second-group': {
              development: {
                docsIds: ['BarComponent'],
                primaryDocsId: 'BarComponent',
              },
              testing: {
                docsIds: [],
              },
              codeExamples: {
                docsIds: ['FooCodeExample1'],
              },
            },
          },
        },
      },
    };

    const errors = validateCodeExamples(
      publicApi,
      documentationConfig,
      '@skyux/code-examples',
    );

    expect(errors).toEqual([]);
  });

  it('should return no errors when there are no code examples', () => {
    const publicApi: SkyManifestPublicApi = {
      packages: {
        '@skyux/code-examples': [],
      },
    };

    const documentationConfig: SkyManifestDocumentationConfig = {
      packages: {
        '@skyux/foo': {
          groups: {
            'first-group': {
              development: {
                docsIds: ['FooComponent'],
                primaryDocsId: 'FooComponent',
              },
              testing: {
                docsIds: [],
              },
              codeExamples: {
                docsIds: [],
              },
            },
          },
        },
      },
    };

    const errors = validateCodeExamples(
      publicApi,
      documentationConfig,
      '@skyux/code-examples',
    );

    expect(errors).toEqual([]);
  });
});
