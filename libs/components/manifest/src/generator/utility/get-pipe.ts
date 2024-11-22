import { type DeclarationReflection, ReflectionKind } from 'typedoc';

import type {
  SkyManifestClassMethodDefinition,
  SkyManifestPipeDefinition,
} from '../../types/manifest';
import { DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators';

import { getAnchorId } from './get-anchor-id';
import { getMethod } from './get-class';
import { getComment } from './get-comment';
import { remapLambdaName } from './remap-lambda-name';

function getPipeTransformMethod(
  decl: DeclarationReflection,
): SkyManifestClassMethodDefinition {
  if (decl.children) {
    for (const child of decl.children) {
      if (child.kind === ReflectionKind.Method && child.name === 'transform') {
        return getMethod(child);
      }
    }
  }

  throw new Error(`Failed to find transform method for pipe: ${decl.name}`);
}

export function getPipe(
  decl: DeclarationReflectionWithDecorators,
  filePath: string,
): SkyManifestPipeDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(decl.comment);

  const templateBindingName = decl.decorators?.[0]?.arguments?.[
    'name'
  ] as string;

  const pipeName = remapLambdaName(decl);

  const pipe: SkyManifestPipeDefinition = {
    anchorId: getAnchorId(pipeName, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'pipe',
    name: pipeName,
    templateBindingName,
    transformMethod: getPipeTransformMethod(decl),
  };

  return pipe;
}
