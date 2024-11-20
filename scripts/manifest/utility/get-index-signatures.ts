import { SkyManifestIndexSignatureDefinition } from 'manifest/types/manifest-types';
import { DeclarationReflection } from 'typedoc';

import { getComment } from './get-comment';
import { getParameters } from './get-parameters';
import { getType } from './get-type';

export function getIndexSignatures(
  decl: DeclarationReflection,
): SkyManifestIndexSignatureDefinition[] {
  const formatted: SkyManifestIndexSignatureDefinition[] = [];

  if (decl.indexSignatures) {
    for (const signature of decl.indexSignatures) {
      const param = signature.parameters?.[0];

      if (param) {
        const {
          codeExample,
          codeExampleLanguage,
          deprecationReason,
          description,
          isDeprecated,
          isPreview,
        } = getComment(signature.comment);

        formatted.push({
          codeExample,
          codeExampleLanguage,
          deprecationReason,
          description,
          isDeprecated,
          isPreview,
          name: `[${param.name}: ${getType(param.type)}]`,
          type: getType(signature.type),
          parameters: getParameters(signature.parameters),
        });
      }
    }
  }

  return formatted;
}
