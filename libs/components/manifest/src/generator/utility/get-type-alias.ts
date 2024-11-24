import { type DeclarationReflection } from 'typedoc';

import type { SkyManifestTypeAliasDefinition } from '../../types/type-alias-def';

import { formatConstAssertionUnionType, formatType } from './format-type';
import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';

export function getTypeAlias(
  reflection: DeclarationReflection,
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
  } = getComment(reflection);

  const formattedType =
    formatConstAssertionUnionType(reflection) ?? formatType(reflection);

  const def: SkyManifestTypeAliasDefinition = {
    anchorId: getAnchorId(reflection.name, reflection.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'type-alias',
    name: reflection.name,
    type: formattedType,
  };

  return def;
}
