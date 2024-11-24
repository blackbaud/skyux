import {
  DeclarationReflection,
  IndexedAccessType,
  QueryType,
  ReferenceType,
  SignatureReflection,
  SomeType,
  TupleType,
  TypeOperatorType,
  TypeParameterReflection,
} from 'typedoc';

export function formatType(reflection: {
  name: string;
  type?: SomeType;
}): string {
  let type: SomeType | undefined;

  if (reflection instanceof DeclarationReflection) {
    type =
      reflection.type ??
      reflection.signatures?.[0].type ??
      reflection.getSignature?.type ??
      reflection.setSignature?.type;
  } else {
    type = reflection.type;
  }

  if (!type) {
    console.warn(
      `\n [!] The type for the reflection \`${reflection.name}\` is not defined. Defaulting to \`unknown\`.`,
    );
    return 'unknown';
    // console.error(reflection);
    // throw new Error('The type cannot be formatted because it is undefined.');
  }

  return type.toString();
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
export function formatTypeParameters(reflection: {
  signatures?: SignatureReflection[];
  typeParameters?: TypeParameterReflection[];
}): string | undefined {
  const typeParameters =
    reflection.typeParameters ?? reflection.signatures?.[0].typeParameters;

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
