import type { SkyManifestTypeAliasDefinition } from '@skyux/manifest-local';

import {
  type DeclarationReflection,
  IndexedAccessType,
  QueryType,
  TupleType,
  TypeOperatorType,
} from 'typedoc';

import { formatType } from './format-type.js';
import { getAnchorId } from './get-anchor-id.js';
import { getComment } from './get-comment.js';
import { getRepoUrl } from './get-repo-url.js';

/**
 * Gets the formatted type for a const assertion union.
 * @example
 * ```
 * const FOO = ['a', 'b', 'c'] as const;
 * type Foo = (typeof FOO)[number];
 *
 * // Returns: "'a' | 'b' | 'c'"
 * ```
 */
function formatConstAssertionUnionType(
  reflection: DeclarationReflection,
): string | undefined {
  if (
    reflection.type instanceof IndexedAccessType &&
    reflection.type.objectType instanceof QueryType
  ) {
    const reference = reflection.parent?.getChildByName(
      reflection.type.objectType.queryType.name,
    );

    if (
      reference &&
      reference.isDeclaration() &&
      reference.type instanceof TypeOperatorType &&
      reference.type.target instanceof TupleType
    ) {
      return formatType(reference);
    }
  }

  return;
}

export function getTypeAlias(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestTypeAliasDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsId,
    extraTags,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(reflection);

  const repoUrl = getRepoUrl(reflection);
  const formattedType =
    formatConstAssertionUnionType(reflection) ?? formatType(reflection);

  const def: SkyManifestTypeAliasDefinition = {
    anchorId: getAnchorId(reflection.name, reflection.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsId: docsId ?? reflection.name,
    extraTags,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'type-alias',
    name: reflection.name,
    repoUrl,
    type: formattedType,
  };

  return def;
}
