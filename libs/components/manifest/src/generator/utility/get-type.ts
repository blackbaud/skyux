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

function getInlineClosure(reflections: SignatureReflection[]): string {
  const params = getParameters(reflections[0].parameters);
  const returnType = getType(reflections[0].type);

  const paramsStr = params
    .map(
      (param) => `${param.name}${param.isOptional ? '?' : ''}: ${param.type}`,
    )
    .join(', ');

  return `(${paramsStr}) => ${returnType}`;
}

function getInlineInterface(reflections: DeclarationReflection[]): string {
  const props = ['{'];

  for (const reflection of reflections) {
    props.push(
      `${reflection.name}${reflection.flags?.isOptional ? '?' : ''}: ${getType(reflection.type)};`,
    );
  }

  props.push('}');

  return props.join(' ');
}

function getTypeParameters(params: SomeType[] | undefined): string {
  if (!params || params.length === 0) {
    return '';
  }

  let name = `<`;

  const typeParams: string[] = [];
  for (const param of params) {
    typeParams.push(getType(param));
  }

  if (typeParams.length === 0) {
    return '';
  }

  name += typeParams.join(', ') + '>';

  return name;
}

function handleArrayType(type: ArrayType): string {
  const elementType = getType(type.elementType);

  if (type.elementType instanceof ReflectionType) {
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
    name += getTypeParameters(type.typeArguments);
  }

  return name;
}

function handleReflectionType(type: ReflectionType): string | undefined {
  const typeDecl = type.declaration;

  if (typeDecl.signatures) {
    return getInlineClosure(typeDecl.signatures);
  }

  if (typeDecl.children) {
    return getInlineInterface(typeDecl.children);
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
    return `[${type.target.elements.map((t) => getType(t)).join(', ')}] as const`;
  }

  return;
}

function handleUnionType(type: UnionType): string {
  return type.types
    .map((t) => {
      let formatted = getType(t);

      if (t instanceof ReflectionType) {
        formatted = wrapWithParentheses(formatted);
      }

      return formatted;
    })
    .join(' | ');
}

function wrapWithParentheses(type: string): string {
  return `(${type})`;
}

export function getType(type: SomeType | undefined): string {
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
    formatted = getType(type.targetType);
  }

  if (!formatted) {
    console.error(type);

    throw new Error(
      'A type was encountered that is not handled by the ' +
        'getType() function. A handler must be added for this type to ' +
        'accommodate all features of the public API.',
    );
  }

  return formatted;
}
