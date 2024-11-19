/* eslint-disable complexity */
import {
  ArrayType,
  DeclarationReflection,
  IntrinsicType,
  LiteralType,
  MappedType,
  ReferenceType,
  ReflectionType,
  SignatureReflection,
  SomeType,
  TypeOperatorType,
  UnionType,
} from 'typedoc';

import { getIndexSignatures } from './get-index-signatures';
import { getParameters } from './get-parameters';

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

function getInlineClosure(refl: SignatureReflection[]): string {
  const params = getParameters(refl[0].parameters);
  const returnType = getType(refl[0].type);

  const paramsStr = params
    .map((p) => {
      return `${p.name}${p.isOptional ? '?' : ''}: ${p.type}`;
    })
    .join(', ');

  return `(${paramsStr}) => ${returnType}`;
}

function getInlineInterface(children: DeclarationReflection[]): string {
  const props = ['{'];

  for (const child of children) {
    props.push(
      `${child.name}${child.flags?.isOptional ? '?' : ''}: ${getType(child.type)};`,
    );
  }

  props.push('}');

  return props.join(' ');
}

export function getType(type: SomeType | undefined): string {
  if (type) {
    if (type instanceof IntrinsicType) {
      return type.name;
    }

    if (type instanceof LiteralType) {
      if (typeof type.value === 'string') {
        return `'${type.value}'`;
      }

      return `${type.value}`;
    }

    // Type parameters.
    if (type instanceof ReferenceType) {
      let name = type.name;

      if (type.typeArguments) {
        name += getTypeParameters(type.typeArguments);
      }

      return name;
    }

    if (type instanceof ReflectionType) {
      const typeDecl = type.declaration;

      // Closures.
      if (typeDecl.signatures) {
        return getInlineClosure(typeDecl.signatures);
      }

      // Inline interfaces.
      if (typeDecl.children) {
        return getInlineInterface(typeDecl.children);
      }

      // Index signatures.
      if (typeDecl.indexSignatures) {
        const sigs = getIndexSignatures(typeDecl);

        return `{ ${sigs[0].name}: ${sigs[0].type}; }`;
      }
    }

    if (type instanceof ArrayType) {
      const elementType = getType(type.elementType);

      if (type.elementType instanceof ReflectionType) {
        return `(${elementType})[]`;
      }

      return `${elementType}[]`;
    }

    if (type instanceof UnionType) {
      return type.types.map((t) => getType(t)).join(' | ');
    }

    if (type instanceof TypeOperatorType) {
      if (type.target instanceof ReferenceType) {
        return `${type.operator} ${type.target.name}`;
      }
    }

    if (type instanceof MappedType) {
      return type.parameter;
    }

    console.error(type);
    throw new Error('^^^^ UNHANDLED TYPE!');
  }

  return 'unknown';
}
