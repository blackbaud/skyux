import type { SkyManifestParentDefinition } from './types/base-def';
import { isDirectiveDefinition } from './utils';

describe('utils', () => {
  it('should check if definition is a directive', () => {
    const definition: SkyManifestParentDefinition = {
      anchorId: '',
      deprecationReason: '',
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
      filePath: '',
      kind: 'service',
      name: '',
    };

    expect(isDirectiveDefinition(definition)).toEqual(false);
  });
});
