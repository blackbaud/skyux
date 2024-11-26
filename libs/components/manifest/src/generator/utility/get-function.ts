import { type DeclarationReflection } from 'typedoc';

import type { SkyManifestFunctionDefinition } from '../../types/function-def';

import { formatType } from './format-type';
import { _formatTypeParameters } from './format-type-custom';
import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getParameters } from './get-parameters';

// TODO: Make the getComment function accept a reflection type?

export function getFunction(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestFunctionDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(reflection);

  const def: SkyManifestFunctionDefinition = {
    anchorId: getAnchorId(reflection.name, reflection.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'function',
    name: reflection.name,
    parameters: getParameters(reflection),
    type: formatType(reflection),
    typeParameters: _formatTypeParameters(reflection),
  };

  return def;
}
