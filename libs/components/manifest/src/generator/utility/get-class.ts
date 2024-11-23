import { type DeclarationReflection, ReflectionKind } from 'typedoc';

import type {
  SkyManifestClassDefinition,
  SkyManifestClassMethodDefinition,
  SkyManifestClassPropertyDefinition,
} from '../../types/class-def';

import { getAnchorId } from './get-anchor-id';
import { getComment } from './get-comment';
import { getDefaultValue } from './get-default-value';
import { isInput, isOutput } from './get-directive';
import { getParameters } from './get-parameters';
import { getType } from './get-type';

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
  const signature = reflection.signatures?.[0];

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
    isStatic: reflection.flags.isStatic ? true : undefined,
    kind: 'class-method',
    name: reflection.name,
    parameters: getParameters(signature?.parameters),
    type: getType(signature?.type),
  };

  return method;
}

export function getProperty(
  reflection: DeclarationReflection,
): SkyManifestClassPropertyDefinition | undefined {
  if (reflection.kind === ReflectionKind.Accessor) {
    const {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationReason,
      description,
      isDeprecated,
      isPreview,
    } = getComment(
      reflection.getSignature?.comment ?? reflection.setSignature?.comment,
    );

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: getDefaultValue(reflection, defaultValue),
      isDeprecated,
      isPreview,
      kind: 'class-property',
      name: reflection.name,
      type: getType(reflection.getSignature?.type),
    };

    return property;
  }

  if (reflection.kind === ReflectionKind.Property) {
    const {
      codeExample,
      codeExampleLanguage,
      defaultValue,
      deprecationReason,
      description,
      isDeprecated,
      isPreview,
    } = getComment(reflection.comment);

    const property: SkyManifestClassPropertyDefinition = {
      codeExample,
      codeExampleLanguage,
      deprecationReason,
      description,
      defaultValue: getDefaultValue(reflection, defaultValue),
      isDeprecated,
      isPreview,
      kind: 'class-property',
      name: reflection.name,
      type: getType(reflection.type),
    };

    return property;
  }

  return;
}

export function getProperties(
  reflection: DeclarationReflection,
): SkyManifestClassPropertyDefinition[] | undefined {
  const properties: SkyManifestClassPropertyDefinition[] = [];

  if (reflection.children) {
    for (const child of reflection.children) {
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
  reflection: DeclarationReflection,
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
  } = getComment(reflection.comment);

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
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind,
    name: reflection.name,
  };

  return def;
}
