import {
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
  SkyManifestPipeDefinition,
} from '@skyux/manifest-local';

import type { DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators.js';

import { getAnchorId } from './get-anchor-id.js';
import { getClass } from './get-class.js';

export function getPipe(
  decl: DeclarationReflectionWithDecorators,
  filePath: string,
): SkyManifestPipeDefinition {
  const reflection = getClass(decl, 'class', filePath);

  const pipeName = reflection.name;
  const templateBindingName = decl.decorators?.[0]?.arguments?.[
    'name'
  ] as string;

  let children:
    | (SkyManifestClassPropertyDefinition | SkyManifestClassMethodDefinition)[]
    | undefined = reflection.children;

  /* v8 ignore start: safety check */
  if (!children) {
    children = [];
  }
  /* v8 ignore stop */

  const pipe: SkyManifestPipeDefinition = {
    ...reflection,
    anchorId: getAnchorId(pipeName, decl.kind),
    children,
    kind: 'pipe',
    name: pipeName,
    templateBindingName,
  };

  return pipe;
}
