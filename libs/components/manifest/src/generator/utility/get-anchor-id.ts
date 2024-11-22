import { ReflectionKind } from 'typedoc';

import { dasherize } from './strings';

/**
 * Returns a URL-safe anchor ID based on the reflection name and kind.
 */
export function getAnchorId(name: string, kind: ReflectionKind): string {
  const letters = name.match(/[a-zA-Z0-1]/g)?.join('');

  if (letters) {
    const anchorId = `${dasherize(ReflectionKind[kind])}-${dasherize(letters)}`;

    return anchorId;
  }

  return `skyux_${Date.now().toString()}`;
}
