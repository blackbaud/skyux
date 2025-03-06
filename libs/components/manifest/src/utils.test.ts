import type { SkyManifestParentDefinition } from './types/base-def';
import {
  isDirectiveDefinition,
  isFunctionDefinition,
  isPipeDefinition,
} from './utils';

describe('utils', () => {
  it('should check if definition is a directive', () => {
    const definition: SkyManifestParentDefinition = {
      anchorId: '',
      deprecationReason: '',
      docsId: 'SkyManifestParentDefinition',
      filePath: '',
      kind: 'directive',
      isDeprecated: false,
      name: '',
      repoUrl: 'https://repo.com/foo',
    };

    expect(isDirectiveDefinition(definition)).toEqual(true);
  });

  it('should check if definition is not a directive', () => {
    const definition: SkyManifestParentDefinition = {
      anchorId: '',
      deprecationReason: '',
      docsId: 'SkyManifestParentDefinition',
      filePath: '',
      kind: 'service',
      name: '',
      repoUrl: 'https://repo.com/foo',
    };

    expect(isDirectiveDefinition(definition)).toEqual(false);
  });

  it('should check if definition is a function', () => {
    const definition = {
      kind: 'function',
    } as SkyManifestParentDefinition;

    expect(isFunctionDefinition(definition)).toEqual(true);

    definition.kind = 'class';

    expect(isFunctionDefinition(definition)).toEqual(false);
  });

  it('should check if definition is a pipe', () => {
    const definition = {
      kind: 'pipe',
    } as SkyManifestParentDefinition;

    expect(isPipeDefinition(definition)).toEqual(true);

    definition.kind = 'class';

    expect(isPipeDefinition(definition)).toEqual(false);
  });
});
