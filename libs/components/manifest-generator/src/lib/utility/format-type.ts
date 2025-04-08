import {
  DeclarationReflection,
  Reflection,
  ReflectionKind,
  SomeType,
} from 'typedoc';

import { getNearestProjectReflection } from './reflections.js';
import { remapLambdaNames } from './remap-lambda-names.js';

function getTypeForAccessor(
  reflection: DeclarationReflection,
): SomeType | undefined {
  const signatures = reflection.getAllSignatures();

  let type = signatures.find(
    (s) => s.kind === ReflectionKind.GetSignature,
  )?.type;

  // The accessor does not have a getter, so we need to find the type from the
  // setter's parameter.
  if (!type) {
    type = signatures.find((s) => s.kind === ReflectionKind.SetSignature)
      ?.parameters?.[0]?.type;
  }

  return type;
}

/**
 * Returns a string representation of a reflection's type.
 */
export function formatType(
  reflection: Reflection & {
    type?: SomeType;
  },
): string {
  let type = reflection.type;

  // If the type has signatures, it's type information is stored there.
  if (!type && reflection instanceof DeclarationReflection) {
    if (reflection.kind === ReflectionKind.Accessor) {
      type = getTypeForAccessor(reflection);
    } else {
      type = reflection
        .getAllSignatures()
        .find((signature) => signature.type)?.type;
    }
  }

  if (!type) {
    return 'unknown';
  }

  // First, format the type using TypeDoc's default formatter.
  let formatted = type.toString();

  // Remap lambda names to their original names.
  formatted = remapLambdaNames(
    formatted,
    getNearestProjectReflection(reflection),
  );

  // TypeDoc puts "undefined" as the first member of a union, but
  // we want it at the end.
  if (formatted.startsWith('undefined |')) {
    const parts = formatted.split(' | ');
    parts.shift();
    parts.push('undefined');
    formatted = parts.join(' | ');
  }

  return formatted;
}
