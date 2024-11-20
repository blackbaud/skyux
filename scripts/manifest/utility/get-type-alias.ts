import { SkyManifestTypeAliasDefinition } from 'manifest/types/manifest-types';
import { DeclarationReflection } from 'typedoc';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getType } from './get-type';

export function getTypeAlias(
  decl: DeclarationReflection,
  filePath: string,
): SkyManifestTypeAliasDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestTypeAliasDefinition = {
    anchorId: getAnchorId(decl),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isPreview,
    kind: 'type-alias',
    name: decl.name,
    type: getType(decl.type),
  };

  return def;
}
