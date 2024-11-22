import { type DeclarationReflection, ReferenceType } from 'typedoc';

import {
  type SkyManifestClassPropertyDefinition,
  type SkyManifestDirectiveDefinition,
  type SkyManifestDirectiveInputDefinition,
} from '../../types/manifest';
import { type DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators';

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

  return;
}

function getInputs(
  decl: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition[] | undefined {
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

  return inputs.length > 0 ? inputs : undefined;
}

function getOutputs(
  decl: DeclarationReflection,
): SkyManifestClassPropertyDefinition[] | undefined {
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

  return outputs.length > 0 ? outputs : undefined;
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
    isInternal,
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
    isInternal,
    isPreview,
    kind,
    name: directiveName,
    selector: getSelector(decl) ?? '',
    inputs: getInputs(decl),
    outputs: getOutputs(decl),
  };

  return directive;
}
