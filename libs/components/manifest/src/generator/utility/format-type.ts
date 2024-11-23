/* eslint-disable complexity */
import {
  ArrayType,
  type DeclarationReflection,
  IntrinsicType,
  LiteralType,
  MappedType,
  PredicateType,
  ReferenceType,
  ReflectionType,
  type SignatureReflection,
  type SomeType,
  TupleType,
  TypeOperatorType,
  UnionType,
} from 'typedoc';

import { getIndexSignatures } from './get-index-signatures';
import { getParameters } from './get-parameters';

function formatInlineClosure(reflections: SignatureReflection[]): string {
  const params = getParameters(reflections[0].parameters);
  const returnType = formatType(reflections[0].type);

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
      `${reflection.name}${reflection.flags?.isOptional ? '?' : ''}: ${formatType(reflection.type)};`,
    );
  }

  props.push('}');

  return props.join(' ');
}

function formatTypeParameters(params: SomeType[] | undefined): string {
  if (!params || params.length === 0) {
    return '';
  }

  let name = `<`;

  const typeParams: string[] = [];
  for (const param of params) {
    typeParams.push(formatType(param));
  }

  if (typeParams.length === 0) {
    return '';
  }

  name += typeParams.join(', ') + '>';

  return name;
}

function handleArrayType(type: ArrayType): string {
  const elementType = formatType(type.elementType);

  if (
    type.elementType instanceof ReflectionType &&
    type.elementType.declaration.signatures
  ) {
    return `${wrapWithParentheses(elementType)}[]`;
  }

  return `${elementType}[]`;
}

function handleLiteralType(type: LiteralType): string {
  return typeof type.value === 'string' ? `'${type.value}'` : `${type.value}`;
}

function handleReferenceType(type: ReferenceType): string {
  let name = type.name;

  if (type.typeArguments) {
    name += formatTypeParameters(type.typeArguments);
  }

  return name;
}

function handleReflectionType(type: ReflectionType): string | undefined {
  const typeDecl = type.declaration;

  if (typeDecl.signatures) {
    return formatInlineClosure(typeDecl.signatures);
  }

  if (typeDecl.children) {
    return formatInlineInterface(typeDecl.children);
  }

  if (typeDecl.indexSignatures) {
    const sigs = getIndexSignatures(typeDecl);

    return `{ ${sigs[0].name}: ${sigs[0].type}; }`;
  }

  return;
}

function handleTypeOperatorType(type: TypeOperatorType): string | undefined {
  if (type.target instanceof ReferenceType) {
    return `${type.operator} ${type.target.name}`;
  }

  // Handle "as const" array types.
  if (type.target instanceof TupleType && type.operator === 'readonly') {
    return `[${type.target.elements.map((t) => formatType(t)).join(', ')}] as const`;
  }

  return;
}

function handleUnionType(type: UnionType): string {
  return type.types
    .map((t) => {
      let formatted = formatType(t);

      // Wrap inline closures with parentheses.
      if (t instanceof ReflectionType && t.declaration.signatures) {
        formatted = wrapWithParentheses(formatted);
      }

      return formatted;
    })
    .join(' | ');
}

function wrapWithParentheses(type: string): string {
  return `(${type})`;
}

export function formatType(type: SomeType | undefined): string {
  let formatted: string | undefined;

  if (typeof type === 'undefined') {
    return 'unknown';
  } else if (type instanceof IntrinsicType) {
    formatted = type.name;
  } else if (type instanceof LiteralType) {
    formatted = handleLiteralType(type);
  } else if (type instanceof ReferenceType) {
    formatted = handleReferenceType(type);
  } else if (type instanceof ReflectionType) {
    formatted = handleReflectionType(type);
  } else if (type instanceof ArrayType) {
    formatted = handleArrayType(type);
  } else if (type instanceof UnionType) {
    formatted = handleUnionType(type);
  } else if (type instanceof TypeOperatorType) {
    formatted = handleTypeOperatorType(type);
  } else if (type instanceof MappedType) {
    formatted = type.parameter;
  } else if (type instanceof PredicateType) {
    formatted = formatType(type.targetType);
  }

  /* istanbul ignore if: safety check */
  if (!formatted) {
    console.error(type);

    throw new Error(
      'A type was encountered that is not handled by the ' +
        'formatType() function. A handler must be added for this type to ' +
        'accommodate all features of the public API.',
    );
  }

  return formatted;
}
