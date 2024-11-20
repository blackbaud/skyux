import {
  SkyManifestInterfaceDefinition,
  SkyManifestInterfacePropertyDefinition,
} from 'manifest/types/manifest-types';
import { DeclarationReflection } from 'typedoc';

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
        isRequired,
      } = getComment(child.comment);

      properties.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isOptional: !isRequired && !!child.flags?.isOptional,
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
): SkyManifestInterfaceDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestInterfaceDefinition = {
    anchorId: getAnchorId(decl),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    indexSignatures: getIndexSignatures(decl),
    isDeprecated,
    isPreview,
    kind: 'interface',
    name: decl.name,
    properties: getInterfaceProperties(decl),
  };

  return def;
}
