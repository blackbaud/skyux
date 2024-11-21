import { DeclarationReflection, ReflectionKind } from 'typedoc';

import {
  SkyManifestClassMethodDefinition,
  SkyManifestPipeDefinition,
} from '../../types/manifest';

import { getAnchorId } from './get-anchor-id';
import { getMethod } from './get-class';
import { getComment } from './get-comment';

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
  decl: DeclarationReflection,
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

  const pipe: SkyManifestPipeDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'pipe',
    name: decl.name,
    transformMethod: getPipeTransformMethod(decl),
  };

  return pipe;
}
