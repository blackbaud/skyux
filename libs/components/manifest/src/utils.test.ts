import type { SkyManifestParentDefinition } from './types/base-def';
import { isDirectiveDefinition } from './utils';

describe('utils', () => {
  it('should check if definition is a directive', () => {
    const definition: SkyManifestParentDefinition = {
      anchorId: '',
      deprecationReason: '',
      docsId: 'SkyManifestParentDefinition',
      docsIncludeIds: undefined,
      filePath: '',
      kind: 'directive',
      isDeprecated: false,
      name: '',
    };

    expect(isDirectiveDefinition(definition)).toEqual(true);
  });

  it('should check if definition is not a directive', () => {
    const definition: SkyManifestParentDefinition = {
      anchorId: '',
      deprecationReason: '',
      docsId: 'SkyManifestParentDefinition',
      docsIncludeIds: ['Foo'],
      filePath: '',
      kind: 'service',
      name: '',
    };

    expect(isDirectiveDefinition(definition)).toEqual(false);
  });
});
