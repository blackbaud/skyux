import {
  type DeclarationReflection,
  ReflectionType,
  type SignatureReflection,
  type SomeType,
} from 'typedoc';

import { getIndexSignatures } from './get-index-signatures';
import { getParameters } from './get-parameters';

function formatInlineClosure(reflections: SignatureReflection[]): string {
  const params = getParameters(reflections[0]);
  const returnType = _formatType(reflections[0].type);

  if (!params) {
    return '___INVALID_CLOSURE___';
  }

  const paramsStr = params
    .map(
      (param) => `${param.name}${param.isOptional ? '?' : ''}: ${param.type}`,
    )
    .join(', ');

  return `(${paramsStr}) => ${returnType}`;
}

function formatInlineInterface(reflections: DeclarationReflection[]): string {
  const props = ['{'];

  for (const reflection of reflections) {
    props.push(
      `${reflection.name}${reflection.flags?.isOptional ? '?' : ''}: ${_formatType(reflection.type)};`,
    );
  }

  props.push('}');

  return props.join(' ');
}

// function formatTypeParameters(params: SomeType[] | undefined): string {
//   if (!params || params.length === 0) {
//     return '';
//   }

//   let name = `<`;

//   const typeParams: string[] = [];

//   for (const param of params) {
//     typeParams.push(_formatType(param));
//   }

//   if (typeParams.length === 0) {
//     console.error(params);
//     throw new Error('Type parameters were provided, but none were formatted.');
//   }

//   name += typeParams.join(', ') + '>';

//   return name;
// }

// function formatArrayType(type: ArrayType): string {
//   const elementType = _formatType(type.elementType);

//   if (
//     type.elementType instanceof ReflectionType &&
//     type.elementType.declaration.signatures
//   ) {
//     return `${wrapWithParentheses(elementType)}[]`;
//   }

//   return `${elementType}[]`;
// }

// function formatLiteralType(type: LiteralType): string {
//   return typeof type.value === 'string' ? `'${type.value}'` : `${type.value}`;
// }

// function formatReferenceType(type: ReferenceType): string {
//   let name = type.name;

//   if (type.typeArguments) {
//     name += formatTypeParameters(type.typeArguments);
//   }

//   return name;
// }

function formatReflectionType(type: ReflectionType): string | undefined {
  const typeDecl = type.declaration;

  if (typeDecl.signatures) {
    return formatInlineClosure(typeDecl.signatures);
  }

  if (typeDecl.children) {
    return formatInlineInterface(typeDecl.children);
  }

  if (typeDecl.indexSignatures) {
    const defs = getIndexSignatures(typeDecl);

    return `{ ${defs[0].name}: ${defs[0].type}; }`;
  }

  return;
}

/**
 * Formats type operator types (e.g., `keyof Foo`).
 */
// function formatTypeOperatorType(type: TypeOperatorType): string | undefined {
//   if (type.target instanceof ReferenceType) {
//     return `${type.operator} ${type.target.name}`;
//   }

//   // Handle "as const" array types.
//   if (type.target instanceof TupleType && type.operator === 'readonly') {
//     return `[${type.target.elements.map((t) => _formatType(t)).join(', ')}] as const`;
//   }

//   return;
// }

// function formatUnionType(type: UnionType): string {
//   return type.types
//     .map((t) => {
//       let formatted = _formatType(t);

//       // Wrap inline closures with parentheses.
//       if (t instanceof ReflectionType && t.declaration.signatures) {
//         formatted = wrapWithParentheses(formatted);
//       }

//       return formatted;
//     })
//     .join(' | ');
// }

// function wrapWithParentheses(type: string): string {
//   return `(${type})`;
// }

/**
 * Formats predicate types (e.g., `type is string`).
 */
// function formatPredicateType(type: PredicateType): string {
//   return `${type.name} is ${_formatType(type.targetType)}`;
// }

/**
 * Formats a MappedType (e.g. `{ [K in keyof T]: string }`)
 */
// function formatMappedType(type: MappedType): string {
//   console.log('MAPPED TYPE:', type.toString());
//   return `{ [${type.parameter} ${_formatType(type.parameterType)}]: ${_formatType(type.templateType)} }`;
// }

export function _formatType(type: SomeType | undefined): string {
  let formatted: string | undefined;

  if (type instanceof ReflectionType) {
    formatted = formatReflectionType(type);
  } else {
    formatted = type?.toString();
  }

  // if (typeof type === 'undefined') {
  //   return '__UNDEFINED__';
  // } else if (type instanceof IntrinsicType) {
  //   formatted = type.name;
  // } else if (type instanceof LiteralType) {
  //   formatted = formatLiteralType(type);
  // } else if (type instanceof ReferenceType) {
  //   formatted = formatReferenceType(type);
  // } else if (type instanceof ReflectionType) {
  //   formatted = formatReflectionType(type);
  // } else if (type instanceof ArrayType) {
  //   formatted = formatArrayType(type);
  // } else if (type instanceof UnionType) {
  //   formatted = formatUnionType(type);
  // } else if (type instanceof TypeOperatorType) {
  //   formatted = formatTypeOperatorType(type);
  // } else if (type instanceof MappedType) {
  //   console.log('mapped type:', type);
  //   formatted = formatMappedType(type);
  // } else if (type instanceof PredicateType) {
  //   formatted = formatPredicateType(type);
  // }

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
