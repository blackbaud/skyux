import { SkyManifestVariableDefinition } from 'manifest/types/manifest-types';
import { DeclarationReflection } from 'typedoc';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getType } from './get-type';

export function getVariable(
  decl: DeclarationReflection,
  filePath: string,
): SkyManifestVariableDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestVariableDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isPreview,
    kind: 'variable',
    name: decl.name,
    type: getType(decl.type),
  };

  return def;
}
