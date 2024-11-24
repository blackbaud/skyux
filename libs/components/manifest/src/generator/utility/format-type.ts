import {
  DeclarationReflection,
  IndexedAccessType,
  QueryType,
  ReferenceType,
  SomeType,
  TupleType,
  TypeOperatorType,
} from 'typedoc';

import { _formatType } from './format-type-custom';

export function formatType(reflection: {
  name: string;
  type?: SomeType;
}): string {
  let type = reflection.type;

  if (!type && reflection instanceof DeclarationReflection) {
    type =
      reflection.type ??
      reflection.getAllSignatures().find((signature) => signature.type)?.type;
  }

  if (!type) {
    console.warn(
      `  [!] The type for the reflection \`${reflection.name}\` is not defined. Defaulting to \`unknown\`.`,
    );

    return 'unknown';
  }

  let formatted = type.toString();

  if (formatted === 'Function' || formatted === 'Object') {
    const customFormatted = _formatType(reflection.type);

    console.warn(
      `  [!] TypeDoc produced \`${formatted}\` but we want a more complete type for \`${reflection.name}\`. ` +
        `Created:
      \`\`\`
      ${customFormatted}
      \`\`\`
`,
    );

    formatted = customFormatted;
  }

  if (formatted.includes('λ')) {
    // TODO: use reflection.parent to find the reference's name.
    console.warn(
      `  [!] A lambda name was encountered when formatting the type for \`${reflection.name}\`. Found: \`${formatted}\``,
    );
  }

  return formatted;
}

/**
 * Gets the formatted type for a const assertion union.
 * @example
 * ```
 * const FOO = ['a', 'b', 'c'] as const;
 * type Foo = (typeof FOO)[number];
 *
 * // Returns: "'a' | 'b' | 'c'"
 * ```
 */
export function formatConstAssertionUnionType(
  reflection: DeclarationReflection,
): string | undefined {
  if (
    reflection.type instanceof IndexedAccessType &&
    reflection.type.objectType instanceof QueryType
  ) {
    const reference = reflection.parent?.getChildByName(
      reflection.type.objectType.queryType.name,
    );

    if (
      reference &&
      reference.isDeclaration() &&
      reference.type instanceof TypeOperatorType &&
      reference.type.target instanceof TupleType
    ) {
      return formatType(reference);
    }
  }

  return;
}

/**
 * Formats type parameters for a reflection (e.g., `<T, U>`).
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

    if (typeParam instanceof ReferenceType) {
      formatted += ` extends ${formatType(typeParam)}`;
    } else if (typeParam.default) {
      formatted += ` = ${typeParam.default.toString()}`;
    }

    params.push(formatted);
  }

  return `<${params.join(', ')}>`;
}
