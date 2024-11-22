import { type DeclarationReflection } from 'typedoc';

import { type SkyManifestFunctionDefinition } from '../../types/manifest';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getParameters } from './get-parameters';
import { getType } from './get-type';

export function getFunction(
  decl: DeclarationReflection,
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
  } = getComment(decl.signatures?.[0]?.comment);

  const signature = decl.signatures?.[0];

  const def: SkyManifestFunctionDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'function',
    name: decl.name,
    parameters: getParameters(signature?.parameters),
    returnType: getType(signature?.type),
  };

  return def;
}
