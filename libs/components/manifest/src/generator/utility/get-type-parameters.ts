import { DeclarationReflection, ReferenceType } from 'typedoc';

import { formatType } from './format-type';

export function getTypeParameters(
  reflection: DeclarationReflection,
): string | undefined {
  if (reflection.typeParameters) {
    const params: string[] = [];

    for (const typeParam of reflection.typeParameters) {
      let formatted = typeParam.name;

      if (typeParam.type instanceof ReferenceType) {
        formatted += ` extends ${formatType(typeParam.type)}`;
      } else if (typeParam.default) {
        formatted += ` = ${formatType(typeParam.default)}`;
      }

      params.push(formatted);
    }

    return `<${params.join(', ')}>`;
  }

  return;
}
