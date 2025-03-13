import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SkyManifestDocumentationConfig } from './types/documentation-config.js';

const documentationConfigJson: SkyManifestDocumentationConfig = {
  packages: {},
};

vi.mock('../documentation-config.json', () => {
  return { default: documentationConfigJson };
});

describe('get-documentation-config', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();

    documentationConfigJson.packages = {};
  });

  it('should return documentation config', async () => {
    documentationConfigJson.packages = {
      '@skyux/foo': {
        groups: {
          group1: {
            docsIds: ['FooModule'],
            primaryDocsId: 'FooModule',
          },
        },
      },
      '@skyux/bar': {
        groups: {
          group2: {
            docsIds: ['BarService'],
            primaryDocsId: 'BarService',
          },
        },
      },
    };

    const { getDocumentationConfig } = await import(
      './get-documentation-config.js'
    );

    const result = getDocumentationConfig();

    expect(result).toEqual(documentationConfigJson);
  });
});
