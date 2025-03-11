import { type DeclarationReflection } from 'typedoc';

import type { SkyManifestIndexSignatureDefinition } from '../../types/interface-def.js';

import { formatType } from './format-type.js';
import { getComment } from './get-comment.js';
import { getParameters } from './get-parameters.js';

export function getIndexSignatures(
  reflection: DeclarationReflection,
): SkyManifestIndexSignatureDefinition[] | undefined {
  if (!reflection.indexSignatures) {
    return;
  }

  const definitions: SkyManifestIndexSignatureDefinition[] = [];

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

      const parameters = getParameters(signature);

      /* istanbul ignore if: safety check */
      if (!parameters) {
        throw new Error(
          `Index signature ${reflection.name} is missing parameters.`,
        );
      }

      definitions.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
        name: `[${param.name}: ${formatType(param)}]`,
        type: formatType(signature),
        parameters,
      });
    }
  }

  return definitions;
}
