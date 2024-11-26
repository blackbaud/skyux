import {
  ArrayType,
  type DeclarationReflection,
  ReflectionType,
  type SignatureReflection,
  type SomeType,
  UnionType,
} from 'typedoc';

import { formatType } from './format-type';
import { getIndexSignatures } from './get-index-signatures';
import { getParameters } from './get-parameters';

/**
 * Formats an "inline" closure type (e.g., `(foo: string) => boolean`).
 */
function formatInlineClosureType(reflections: SignatureReflection[]): string {
  const params = getParameters(reflections[0]);
  const returnType = _formatType(reflections[0].type);

  let paramsString = '';

  if (params) {
    paramsString = params
      .map(
        (param) => `${param.name}${param.isOptional ? '?' : ''}: ${param.type}`,
      )
      .join(', ');
  }

  return `(${paramsString}) => ${returnType}`;
}

/**
 * Formats an "inline" interface type (e.g., `{ foo: string; bar: number }`).
 */
function formatInlineInterfaceType(
  reflections: DeclarationReflection[],
): string {
  const props = ['{'];

  for (const reflection of reflections) {
    props.push(
      `${reflection.name}${reflection.flags?.isOptional ? '?' : ''}: ${_formatType(reflection.type)};`,
    );
  }

  props.push('}');

  return props.join(' ');
}

function formatArrayType(type: ArrayType): string {
  let formatted = _formatType(type.elementType);

  // Wrap inline closures with parentheses.
  if (
    type.elementType instanceof ReflectionType &&
    type.elementType.declaration.signatures
  ) {
    formatted = wrapWithParentheses(formatted);
  }

  return `${formatted}[]`;
}

function formatReflectionType(type: ReflectionType): string | undefined {
  const typeDecl = type.declaration;

  if (typeDecl.signatures) {
    return formatInlineClosureType(typeDecl.signatures);
  }

  if (typeDecl.children) {
    return formatInlineInterfaceType(typeDecl.children);
  }

  if (typeDecl.indexSignatures) {
    const defs = getIndexSignatures(typeDecl);

    return `{ ${defs?.[0].name}: ${defs?.[0].type}; }`;
  }

  /* istanbul ignore next: safety check */
  throw new Error(
    `Unhandled reflection type: ${typeDecl.name} ${typeDecl.toString()}`,
  );
}

function formatUnionType(type: UnionType): string {
  return type.types
    .map((t) => {
      let formatted = _formatType(t);

      // Wrap inline closures with parentheses.
      if (t instanceof ReflectionType && t.declaration.signatures) {
        formatted = wrapWithParentheses(formatted);
      }

      return formatted;
    })
    .join(' | ');
}

function wrapWithParentheses(value: string): string {
  return `(${value})`;
}

/**
 * TypeDoc has a built-in `toString()` method for types, but it doesn't handle
 * function or object types very well. This function serves as a placeholder
 * for those types until TypeDoc gives us the ability to format them in the ways
 * we need. (The underscore is used to discourage direct use of this function,
 * if possible.)
 */
export function _formatType(type: SomeType | undefined): string {
  let formatted: string | undefined;

  if (type instanceof ReflectionType) {
    formatted = formatReflectionType(type);
  } else if (type instanceof UnionType) {
    formatted = formatUnionType(type);
  } else if (type instanceof ArrayType) {
    formatted = formatArrayType(type);
  } else {
    formatted = type?.toString();
  }

  /* istanbul ignore if: safety check */
  if (!formatted) {
    console.error(type);

    throw new Error(
      'A type was encountered that is not handled by the ' +
        '_formatType() function. A formatter must be added for this type to ' +
        'accommodate all features of the public API.',
    );
  }

  return formatted;
}

/**
 * Formats type parameters for a reflection (e.g., `<T, U>`). (The underscore is
 * used to discourage direct use of this function, if possible.)
 */
export function _formatTypeParameters(
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
