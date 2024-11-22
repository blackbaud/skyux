import type { SkyManifestPipeDefinition } from '../../types/pipe-def';
import type { DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators';

import { getAnchorId } from './get-anchor-id';
import { getClass } from './get-class';
import { remapLambdaName } from './remap-lambda-name';

export function getPipe(
  decl: DeclarationReflectionWithDecorators,
  filePath: string,
): SkyManifestPipeDefinition {
  const reflection = getClass(decl, 'class', filePath);

  const templateBindingName = decl.decorators?.[0]?.arguments?.[
    'name'
  ] as string;

  const pipeName = remapLambdaName(decl);

  const pipe: SkyManifestPipeDefinition = {
    ...reflection,
    anchorId: getAnchorId(pipeName, decl.kind),
    children: reflection.children ?? [],
    kind: 'pipe',
    name: pipeName,
    templateBindingName,
  };

  return pipe;
}
