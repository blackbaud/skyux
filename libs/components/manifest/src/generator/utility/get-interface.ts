import { type DeclarationReflection } from 'typedoc';

import {
  type SkyManifestInterfaceDefinition,
  type SkyManifestInterfacePropertyDefinition,
} from '../../types/manifest';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getIndexSignatures } from './get-index-signatures';
import { getType } from './get-type';

function getInterfaceProperties(
  decl: DeclarationReflection,
): SkyManifestInterfacePropertyDefinition[] {
  const properties: SkyManifestInterfacePropertyDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      const {
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
      } = getComment(child.comment);

      const isOptional = child.flags.isOptional ? true : undefined;

      properties.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isOptional,
        isPreview,
        name: child.name,
        type: getType(child.type),
      });
    }
  }

  return properties;
}

export function getInterface(
  decl: DeclarationReflection,
  filePath: string,
): SkyManifestInterfaceDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestInterfaceDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    indexSignatures: getIndexSignatures(decl),
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'interface',
    name: decl.name,
    properties: getInterfaceProperties(decl),
  };

  return def;
}
