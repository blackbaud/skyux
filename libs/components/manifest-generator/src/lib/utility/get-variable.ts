import type { SkyManifestVariableDefinition } from '@skyux/manifest-local';

import { type DeclarationReflection } from 'typedoc';

import { formatType } from './format-type.js';
import { getAnchorId } from './get-anchor-id.js';
import { getComment } from './get-comment.js';
import { getRepoUrl } from './get-repo-url.js';

export function getVariable(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestVariableDefinition {
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

  const def: SkyManifestVariableDefinition = {
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
    kind: 'variable',
    name: reflection.name,
    repoUrl,
    type: formatType(reflection),
  };

  return def;
}
