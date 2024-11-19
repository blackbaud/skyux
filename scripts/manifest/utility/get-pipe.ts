import {
  SkyManifestClassMethodDefinition,
  SkyManifestPipeDefinition,
} from 'manifest/types';
import { DeclarationReflection, ReflectionKind } from 'typedoc';

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
  docsSection: string,
): SkyManifestPipeDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(decl.comment);

  const pipe: SkyManifestPipeDefinition = {
    anchorId: getAnchorId(decl),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsSection,
    isDeprecated,
    isPreview,
    name: decl.name,
    transformMethod: getPipeTransformMethod(decl),
  };

  return pipe;
}
