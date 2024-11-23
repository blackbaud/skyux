import { type DeclarationReflection } from 'typedoc';

import type { SkyManifestTypeAliasDefinition } from '../../types/type-alias-def';

import { formatConstAssertionUnionType } from './format-const-assertion-union-type';
import { formatType } from './format-type';
import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';

export function getTypeAlias(
  decl: DeclarationReflection,
  parentRefl: DeclarationReflection,
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

  const formattedType =
    formatConstAssertionUnionType(decl, parentRefl) ?? formatType(decl.type);

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
    type: formattedType,
  };

  return def;
}
