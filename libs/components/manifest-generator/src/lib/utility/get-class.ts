import type {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
} from '@skyux/manifest-local';

import { type DeclarationReflection, ReflectionKind } from 'typedoc';

import { formatTypeParameters } from './format-type-custom.js';
import { formatType } from './format-type.js';
import { getAnchorId } from './get-anchor-id.js';
import { getComment } from './get-comment.js';
import { getDefaultValue } from './get-default-value.js';
import { getParameters } from './get-parameters.js';
import { getRepoUrl } from './get-repo-url.js';
import { remapLambdaName } from './remap-lambda-names.js';

export function getMethods(
  reflection: DeclarationReflection,
): SkyManifestClassMethodDefinition[] | undefined {
  const methods: SkyManifestClassMethodDefinition[] = [];

  if (reflection.children) {
    for (const child of reflection.children) {
      if (
        child.kind === ReflectionKind.Method &&
        !child.name.startsWith('ng')
      ) {
        methods.push(getMethod(child));
      }
    }
  }

  return methods.length > 0 ? methods : undefined;
}

export function getMethod(
  reflection: DeclarationReflection,
): SkyManifestClassMethodDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(reflection);

  const method: SkyManifestClassMethodDefinition = {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
    isStatic: reflection.flags.isStatic ? true : undefined,
    kind: 'class-method',
    name: reflection.name,
    parameters: getParameters(reflection),
    type: formatType(reflection),
    typeParameters: formatTypeParameters(reflection),
  };

  return method;
}

export function getProperty(
  reflection: DeclarationReflection,
): SkyManifestClassPropertyDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    defaultValue,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(reflection);

  const property: SkyManifestClassPropertyDefinition = {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    defaultValue: getDefaultValue(reflection, defaultValue),
    isDeprecated,
    isPreview,
    isInternal,
    isStatic: reflection.flags.isStatic ? true : undefined,
    kind: 'class-property',
    name: reflection.name,
    type: formatType(reflection),
  };

  return property;
}

export function getProperties(
  reflection: DeclarationReflection,
): SkyManifestClassPropertyDefinition[] | undefined {
  const properties: SkyManifestClassPropertyDefinition[] = [];

  if (reflection.children) {
    for (const child of reflection.children) {
      if (
        child.name !== 'constructor' &&
        child.kind !== ReflectionKind.Method
      ) {
        const property = getProperty(child);
        properties.push(property);
      }
    }
  }

  return properties.length > 0 ? properties : undefined;
}

export function getClass(
  reflection: DeclarationReflection,
  kind: 'class' | 'module' | 'service',
  filePath: string,
): SkyManifestClassDefinition {
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
  } = getComment(reflection);

  const repoUrl = getRepoUrl(reflection);
  const className = remapLambdaName(reflection);
  const methods = getMethods(reflection) ?? [];
  const properties = getProperties(reflection) ?? [];
  const children = [...methods, ...properties];

  const def: SkyManifestClassDefinition = {
    anchorId: getAnchorId(reflection.name, reflection.kind),
    children: children.length > 0 ? children : undefined,
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsId: docsId ?? className,
    extraTags,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind,
    name: className,
    repoUrl,
    typeParameters: formatTypeParameters(reflection),
  };

  return def;
}
