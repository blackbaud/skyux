import type { SkyManifestFunctionDefinition } from '@skyux/manifest-local';

import { type DeclarationReflection } from 'typedoc';

import { formatTypeParameters } from './format-type-custom.js';
import { formatType } from './format-type.js';
import { getAnchorId } from './get-anchor-id.js';
import { getComment } from './get-comment.js';
import { getParameters } from './get-parameters.js';
import { getRepoUrl } from './get-repo-url.js';

export function getFunction(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestFunctionDefinition {
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

  const def: SkyManifestFunctionDefinition = {
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
    kind: 'function',
    name: reflection.name,
    parameters: getParameters(reflection),
    repoUrl,
    type: formatType(reflection),
    typeParameters: formatTypeParameters(reflection),
  };

  return def;
}
