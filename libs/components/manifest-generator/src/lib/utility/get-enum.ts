import type {
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
} from '@skyux/manifest-local';

import { type DeclarationReflection } from 'typedoc';

import { formatType } from './format-type.js';
import { getAnchorId } from './get-anchor-id.js';
import { getComment } from './get-comment.js';
import { getRepoUrl } from './get-repo-url.js';

function getEnumMembers(
  reflection: DeclarationReflection,
): SkyManifestEnumerationMemberDefinition[] {
  const members: SkyManifestEnumerationMemberDefinition[] = [];

  if (reflection.children) {
    for (const child of reflection.children) {
      const {
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
      } = getComment(child);

      members.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
        kind: 'enum-member',
        name: child.name,
        type: formatType(child),
      });
    }
  }

  return members;
}

export function getEnum(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestEnumerationDefinition {
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

  const def: SkyManifestEnumerationDefinition = {
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
    kind: 'enumeration',
    children: getEnumMembers(reflection),
    name: reflection.name,
    repoUrl,
  };

  return def;
}
