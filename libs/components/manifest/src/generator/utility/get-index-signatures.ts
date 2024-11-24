import { type DeclarationReflection } from 'typedoc';

import { SkyManifestParameterDefinition } from '../../types/function-def';
import type { SkyManifestIndexSignatureDefinition } from '../../types/interface-def';

import { formatType } from './format-type';
import { getComment } from './get-comment';
import { getParameters } from './get-parameters';

export function getIndexSignatures(
  reflection: DeclarationReflection,
): SkyManifestIndexSignatureDefinition[] {
  const definitions: SkyManifestIndexSignatureDefinition[] = [];

  if (reflection.indexSignatures) {
    for (const signature of reflection.indexSignatures) {
      const param = signature.parameters?.[0];

      if (param) {
        const {
          codeExample,
          codeExampleLanguage,
          deprecationReason,
          description,
          isDeprecated,
          isPreview,
        } = getComment(signature);

        definitions.push({
          codeExample,
          codeExampleLanguage,
          deprecationReason,
          description,
          isDeprecated,
          isPreview,
          name: `[${param.name}: ${formatType(param)}]`,
          type: formatType(signature),
          parameters: getParameters(
            signature,
          ) as SkyManifestParameterDefinition[],
        });
      }
    }
  }

  return definitions;
}
