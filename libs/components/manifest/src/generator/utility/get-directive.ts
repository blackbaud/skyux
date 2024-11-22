import { type DeclarationReflection, ReferenceType } from 'typedoc';

import type {
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
} from '../../types/directive-def';
import { type DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators';

import { getAnchorId } from './get-anchor-id';
import { getProperty } from './get-class';
import { getComment } from './get-comment';
import { getDecorator } from './get-decorator';
import { remapLambdaName } from './remap-lambda-name';

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
      kind: 'directive-input',
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

function getOutput(
  decl: DeclarationReflection,
): SkyManifestDirectiveOutputDefinition | undefined {
  const property = getProperty(decl);

  if (property) {
    const output: SkyManifestDirectiveOutputDefinition = {
      ...property,
      kind: 'directive-output',
    };

    return output;
  }

  return;
}

function getOutputs(
  decl: DeclarationReflection,
): SkyManifestDirectiveOutputDefinition[] | undefined {
  const outputs: SkyManifestDirectiveOutputDefinition[] = [];

  if (decl.children) {
    for (const child of decl.children) {
      if (isOutput(child)) {
        const output = getOutput(child);

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

  const directiveName = remapLambdaName(decl);

  const inputs = getInputs(decl) ?? [];
  const outputs = getOutputs(decl) ?? [];
  const children = [...inputs, ...outputs];

  const directive: SkyManifestDirectiveDefinition = {
    anchorId: getAnchorId(directiveName, decl.kind),
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
    name: directiveName,
    selector: getSelector(decl) ?? '',
  };

  return directive;
}
