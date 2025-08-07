import type {
  SkyManifestInterfaceDefinition,
  SkyManifestInterfacePropertyDefinition,
} from '@skyux/manifest-local';

import { type DeclarationReflection } from 'typedoc';

import { formatType } from './format-type.js';
import { getAnchorId } from './get-anchor-id.js';
import { getComment } from './get-comment.js';
import { getIndexSignatures } from './get-index-signatures.js';
import { getRepoUrl } from './get-repo-url.js';

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
        isInternal,
        isPreview,
      } = getComment(child);

      const isOptional = child.flags.isOptional ? true : undefined;

      properties.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isInternal,
        isOptional,
        isPreview,
        kind: 'interface-property',
        name: child.name,
        type: formatType(child),
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
    docsId,
    extraTags,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(decl);

  const repoUrl = getRepoUrl(decl);
  const indexSignatures = getIndexSignatures(decl);
  const children = getInterfaceProperties(decl);

  const def: SkyManifestInterfaceDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    children: children.length > 0 ? children : undefined,
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsId: docsId ?? decl.name,
    extraTags,
    filePath,
    indexSignatures,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'interface',
    name: decl.name,
    repoUrl,
  };

  return def;
}
