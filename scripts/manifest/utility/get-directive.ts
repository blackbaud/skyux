import { DeclarationReflectionWithDecorators } from 'manifest/types/declaration-reflection-with-decorators';
import {
  SkyManifestClassPropertyDefinition,
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
} from 'manifest/types/manifest-types';
import { DeclarationReflection, ReferenceType } from 'typedoc';

import { getAnchorId } from './get-anchor-id';
import { getProperty } from './get-class';
import { getComment } from './get-comment';
import { getDecorator } from './get-decorator';

export function isInput(decl: DeclarationReflectionWithDecorators): boolean {
  return (
    getDecorator(decl) === 'Input' ||
    (decl.type instanceof ReferenceType && decl.type?.name === 'InputSignal')
  );
}

export function isOutput(decl: DeclarationReflectionWithDecorators): boolean {
  return (
    getDecorator(decl) === 'Output' ||
    (decl.type instanceof ReferenceType &&
      decl.type?.name === 'OutputEmitterRef')
  );
}

function getInput(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition | undefined {
  const property = getProperty(decl);

  if (property) {
    const { isRequired } = getComment(
      decl.comment ?? decl.getSignature?.comment ?? decl.setSignature?.comment,
    );

    const input: SkyManifestDirectiveInputDefinition = {
      ...property,
      isRequired,
    };

    return input;
  }
}

function getInputs(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition[] {
  const inputs: SkyManifestDirectiveInputDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isInput(child)) {
        const input = getInput(child);

        if (input) {
          inputs.push(input);
        }
      }
    }
  }

  return inputs;
}

function getOutputs(
  decl: DeclarationReflection,
): SkyManifestClassPropertyDefinition[] {
  const outputs: SkyManifestClassPropertyDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isOutput(child)) {
        const output = getProperty(child);

        if (output) {
          outputs.push(output);
        }
      }
    }
  }

  return outputs;
}

function getSelector(
  decl: DeclarationReflectionWithDecorators,
): string | undefined {
  return decl.decorators?.[0]?.arguments?.['selector'];
}

function getDirectiveName(decl: DeclarationReflection): string {
  if (decl.name.startsWith('λ')) {
    return decl.escapedName as string;
  }

  return decl.name;
}

export function getDirective(
  decl: DeclarationReflectionWithDecorators,
  kind: 'component' | 'directive',
  filePath: string,
): SkyManifestDirectiveDefinition {
  const {
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    isDeprecated,
    isPreview,
  } = getComment(decl.comment);

  const directiveName = getDirectiveName(decl);

  const directive: SkyManifestDirectiveDefinition = {
    anchorId: getAnchorId(directiveName, decl.kind),
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    filePath,
    isDeprecated,
    isPreview,
    kind,
    name: directiveName,
    selector: getSelector(decl) ?? '',
    inputs: getInputs(decl),
    outputs: getOutputs(decl),
  };

  return directive;
}
