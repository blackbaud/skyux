import { DeclarationReflection, ReflectionKind } from 'typedoc';

import {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
} from '../../types/manifest';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getDefaultValue } from './get-default-value';
import { isInput, isOutput } from './get-directive';
import { getParameters } from './get-parameters';
import { getType } from './get-type';

export function getMethods(
  decl: DeclarationReflection,
): SkyManifestClassMethodDefinition[] | undefined {
  const methods: SkyManifestClassMethodDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
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
  decl: DeclarationReflection,
): SkyManifestClassMethodDefinition {
  const signature = decl.signatures?.[0];

  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(signature?.comment);

  const method: SkyManifestClassMethodDefinition = {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
    isStatic: decl.flags.isStatic ? true : undefined,
    name: decl.name,
    parameters: getParameters(signature?.parameters),
    returnType: getType(signature?.type),
  };

  return method;
}

export function getProperty(
  decl: DeclarationReflection,
): SkyManifestClassPropertyDefinition | undefined {
  if (decl.kind === ReflectionKind.Accessor) {
    const {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationReason,
      description,
      isDeprecated,
      isPreview,
    } = getComment(decl.getSignature?.comment ?? decl.setSignature?.comment);

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: getDefaultValue(decl, defaultValue),
      isDeprecated,
      isPreview,
      name: decl.name,
      type: getType(decl.getSignature?.type),
    };

    return property;
  }

  if (decl.kind === ReflectionKind.Property) {
    const {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationReason,
      description,
      isDeprecated,
      isPreview,
    } = getComment(decl.comment);

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: getDefaultValue(decl, defaultValue),
      isDeprecated,
      isPreview,
      name: decl.name,
      type: getType(decl.type),
    };

    return property;
  }

  return;
}

export function getProperties(
  decl: DeclarationReflection,
): SkyManifestClassPropertyDefinition[] | undefined {
  const properties: SkyManifestClassPropertyDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isInput(child) || isOutput(child)) {
        continue;
      }

      const property = getProperty(child);

      if (property) {
        properties.push(property);
      }
    }
  }

  return properties.length > 0 ? properties : undefined;
}

export function getClass(
  decl: DeclarationReflection,
  kind: 'class' | 'module' | 'service',
  filePath: string,
): SkyManifestClassDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isInternal,
    isPreview,
  } = getComment(decl.comment);

  const def: SkyManifestClassDefinition = {
    anchorId: getAnchorId(decl.name, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind,
    methods: getMethods(decl),
    name: decl.name,
    properties: getProperties(decl),
  };

  return def;
}
