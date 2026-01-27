import type { SkyManifestIndexSignatureDefinition } from '@skyux/manifest-local';

import { type DeclarationReflection } from 'typedoc';

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

    /* v8 ignore else -- @preserve */
    if (param) {
      const {
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isInternal,
        isPreview,
      } = getComment(signature);

      const parameters = getParameters(signature);

      /* v8 ignore start: safety check */
      if (!parameters) {
        throw new Error(
          `Index signature ${reflection.name} is missing parameters.`,
        );
      }
      /* v8 ignore stop */

      definitions.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isInternal,
        isPreview,
        name: `[${param.name}: ${formatType(param)}]`,
        type: formatType(signature),
        parameters,
      });
    }
  }

  return definitions;
}
