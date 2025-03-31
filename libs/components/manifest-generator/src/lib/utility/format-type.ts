import {
  ArrayType,
  DeclarationReflection,
  Reflection,
  ReflectionKind,
  ReflectionType,
  SomeType,
  UnionType,
} from 'typedoc';

import { formatTypeCustom } from './format-type-custom.js';
import { getNearestProjectReflection } from './reflections.js';
import { remapLambdaNames } from './remap-lambda-names.js';

/**
 * Whether a type needs custom formatting. TypeDoc returns an expressive string
 * representation of all types except for its ReflectionType, which will output
 * either "Function" or "Object". This function checks if a type is a
 * ReflectionType or if its a type that might have a ReflectionType nested
 * within it.
 */
function needsCustomFormatting(type: SomeType): boolean {
  return !!(
    type instanceof ReflectionType ||
    (type instanceof UnionType &&
      type.types.find(
        (t) =>
          t instanceof ReflectionType ||
          (t instanceof ArrayType && t.elementType instanceof ReflectionType),
      )) ||
    (type instanceof ArrayType && type.elementType instanceof ReflectionType)
  );
}

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

  if (needsCustomFormatting(type)) {
    const customFormatted = formatTypeCustom(reflection.type);

    if (customFormatted !== formatted) {
      console.warn(
        `  [!] TypeDoc produced \`${formatted}\` for the ${ReflectionKind[reflection.kind].toLocaleLowerCase()} \`${reflection.name}\`, but we want a more expressive type for \`${reflection.name}\`. ` +
          `Created:
        \`\`\`
        ${customFormatted}
        \`\`\`
    `,
      );

      formatted = customFormatted;
    } else {
      // We can remove the custom formatter once the following issue is addressed:
      // https://github.com/TypeStrong/typedoc/issues/2917
      console.error(
        `  [x] Hold up! TypeDoc generated \`${formatted}\` for the ${ReflectionKind[reflection.kind].toLocaleLowerCase()} \`${reflection.name}\` which is the same output as our custom formatter. Consider using TypeDoc's formatter instead of our own.`,
      );
    }
  }

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
