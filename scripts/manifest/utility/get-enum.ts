import {
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
} from 'manifest/types';
import { DeclarationReflection } from 'typedoc';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getType } from './get-type';

function getEnumMembers(
  decl: DeclarationReflection,
): SkyManifestEnumerationMemberDefinition[] {
  const members: SkyManifestEnumerationMemberDefinition[] = [];

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

      members.push({
        codeExample,
        codeExampleLanguage,
        deprecationReason,
        description,
        isDeprecated,
        isPreview,
        name: child.name,
        type: getType(child.type),
      });
    }
  }

  return members;
}

export function getEnum(
  decl: DeclarationReflection,
  docsSection: string,
): SkyManifestEnumerationDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestEnumerationDefinition = {
    anchorId: getAnchorId(decl),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsSection,
    isDeprecated,
    isPreview,
    members: getEnumMembers(decl),
    name: decl.name,
  };

  return def;
}
