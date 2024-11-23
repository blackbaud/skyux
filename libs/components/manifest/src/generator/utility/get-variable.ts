import { type DeclarationReflection } from 'typedoc';

import type { SkyManifestVariableDefinition } from '../../types/variable-def';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getType } from './get-type';

export function getVariable(
  reflection: DeclarationReflection,
  filePath: string,
): SkyManifestVariableDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(reflection.comment);

  const def: SkyManifestVariableDefinition = {
    anchorId: getAnchorId(reflection.name, reflection.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'variable',
    name: reflection.name,
    type: getType(reflection.type),
  };

  return def;
}
