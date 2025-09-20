import { type DeclarationReflection } from 'typedoc';

import { formatType } from './format-type.js';

/**
 * Formats type parameters for a reflection (e.g., `<T, U>`).
 * Note: TypeDoc does not handle this properly, and returns "Object".
 */
export function formatTypeParameters(
  reflection: DeclarationReflection,
): string | undefined {
  const typeParameters =
    reflection.typeParameters ??
    reflection.getAllSignatures().find((signature) => signature.typeParameters)
      ?.typeParameters;

  if (!typeParameters) {
    return;
  }

  const params: string[] = [];

  for (const typeParam of typeParameters) {
    let formatted = typeParam.name;

    if (typeParam.default) {
      formatted += ` = ${typeParam.default.toString()}`;
    } else {
      formatted += ` extends ${formatType(typeParam)}`;
    }

    params.push(formatted);
  }

  return `<${params.join(', ')}>`;
}
