import { type DeclarationReflection } from 'typedoc';

import type { SkyManifestFunctionDefinition } from '../../types/function-def';

import { formatType } from './format-type';
import { formatTypeParameters } from './format-type-custom';
import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getParameters } from './get-parameters';
import { getRepoUrl } from './get-repo-url';

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
