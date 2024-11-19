import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { dasherize } from './strings';

export function getAnchorId(decl: DeclarationReflection): string {
  const letters = decl.name.match(/[a-zA-Z0-1]/g)?.join('');

  if (letters) {
    const anchorId = `${dasherize(ReflectionKind[decl.kind])}-${dasherize(letters)}`;

    return anchorId;
  }

  return `skyux_${Date.now().toString()}`;
}
