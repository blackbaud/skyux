import { SkyManifestFunctionDefinition } from 'manifest/types/manifest-types';
import { DeclarationReflection } from 'typedoc';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getParameters } from './get-parameters';
import { getType } from './get-type';

export function getFunction(
  decl: DeclarationReflection,
): SkyManifestFunctionDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,

    isDeprecated,
    isPreview,
  } = getComment(decl.signatures?.[0]?.comment);

  const signature = decl.signatures?.[0];

  const def: SkyManifestFunctionDefinition = {
    anchorId: getAnchorId(decl),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
    name: decl.name,
    parameters: getParameters(signature?.parameters),
    returnType: getType(signature?.type),
  };

  return def;
}
