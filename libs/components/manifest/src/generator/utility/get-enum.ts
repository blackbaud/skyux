import { type DeclarationReflection } from 'typedoc';

import type {
  SkyManifestEnumerationDefinition,
  SkyManifestEnumerationMemberDefinition,
} from '../../types/enumeration-def';
import '../../types/manifest';

import { formatType } from './format-type';
import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';

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
        kind: 'enum-member',
        name: child.name,
        type: formatType(child.type),
      });
    }
  }

  return members;
}

export function getEnum(
  decl: DeclarationReflection,
  filePath: string,
): SkyManifestEnumerationDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestEnumerationDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind: 'enumeration',
    children: getEnumMembers(decl),
    name: decl.name,
  };

  return def;
}
