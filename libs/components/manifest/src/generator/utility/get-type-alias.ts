import { DeclarationReflection } from 'typedoc';

import { SkyManifestTypeAliasDefinition } from '../../types/manifest';

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
    isInternal,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestTypeAliasDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'type-alias',
    name: decl.name,
    type: getType(decl.type),
  };

  return def;
}
