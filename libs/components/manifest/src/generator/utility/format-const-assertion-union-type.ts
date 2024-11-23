import {
  DeclarationReflection,
  IndexedAccessType,
  QueryType,
  TupleType,
  TypeOperatorType,
} from 'typedoc';

import { getType } from './get-type';

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
  parent: DeclarationReflection,
): string | undefined {
  if (
    reflection.type instanceof IndexedAccessType &&
    reflection.type.objectType instanceof QueryType
  ) {
    const reference = parent.getChildByName(
      reflection.type.objectType.queryType.name,
    );

    if (
      reference &&
      reference.isDeclaration() &&
      reference.type instanceof TypeOperatorType &&
      reference.type.target instanceof TupleType
    ) {
      return reference.type.target.elements.map((e) => getType(e)).join(' | ');
    }
  }

  return;
}
