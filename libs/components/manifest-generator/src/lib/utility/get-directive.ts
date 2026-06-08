import type {
  SkyManifestDirectiveDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
} from '@skyux/manifest-local';

import { type DeclarationReflection, ReferenceType } from 'typedoc';

import type { DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators.js';

import { getAnchorId } from './get-anchor-id.js';
import { getProperty } from './get-class.js';
import { getComment } from './get-comment.js';
import { getDecorator } from './get-decorator.js';
import { getRepoUrl } from './get-repo-url.js';
import { remapLambdaName } from './remap-lambda-names.js';

export function isInput(
  reflection: DeclarationReflectionWithDecorators,
): boolean {
  return getDecorator(reflection) === 'Input' || isInputSignal(reflection);
}

function isInputSignal(
  reflection: DeclarationReflectionWithDecorators,
): boolean {
  return (
    reflection.type instanceof ReferenceType &&
    (reflection.type?.name === 'InputSignal' ||
      reflection.type?.name === 'InputSignalWithTransform' ||
      reflection.type?.name === 'ModelSignal')
  );
}

export function isOutput(
  reflection: DeclarationReflectionWithDecorators,
): boolean {
  return (
    getDecorator(reflection) === 'Output' ||
    (reflection.type instanceof ReferenceType &&
      reflection.type?.name === 'OutputEmitterRef')
  );
}

function getInput(
  reflection: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition {
  const property = getProperty(reflection);
  const { isRequired } = getComment(reflection);

  // Use the input's alias, if provided.
  const inputName =
    reflection.decorators?.[0]?.arguments?.['bindingPropertyName'] ??
    property.name;

  const input: SkyManifestDirectiveInputDefinition = {
    ...property,
    kind: 'directive-input',
    isRequired,
    name: inputName,
  };

  return input;
}

function getInputs(
  reflection: DeclarationReflectionWithDecorators,
): SkyManifestDirectiveInputDefinition[] | undefined {
  const inputs: SkyManifestDirectiveInputDefinition[] = [];

  /* v8 ignore else -- @preserve */
  if (reflection.children) {
    for (const child of reflection.children) {
      if (isInput(child)) {
        inputs.push(getInput(child));
      }
    }
  }

  return inputs.length > 0 ? inputs : undefined;
}

function getOutput(
  reflection: DeclarationReflection,
): SkyManifestDirectiveOutputDefinition {
  const property = getProperty(reflection);
  const output: SkyManifestDirectiveOutputDefinition = {
    ...property,
    kind: 'directive-output',
  };

  return output;
}

function getOutputs(
  reflection: DeclarationReflection,
): SkyManifestDirectiveOutputDefinition[] | undefined {
  const outputs: SkyManifestDirectiveOutputDefinition[] = [];

  /* v8 ignore else -- @preserve */
  if (reflection.children) {
    for (const child of reflection.children) {
      if (isOutput(child)) {
        outputs.push(getOutput(child));
      }
    }
  }

  return outputs.length > 0 ? outputs : undefined;
}

function getSelector(
  reflection: DeclarationReflectionWithDecorators,
): string | undefined {
  return reflection.decorators?.[0]?.arguments?.['selector'];
}

export function getDirective(
  reflection: DeclarationReflectionWithDecorators,
  kind: 'component' | 'directive',
  filePath: string,
): SkyManifestDirectiveDefinition {
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
  const directiveName = remapLambdaName(reflection);
  const inputs = getInputs(reflection) ?? [];
  const outputs = getOutputs(reflection) ?? [];
  const children = [...inputs, ...outputs];

  const directive: SkyManifestDirectiveDefinition = {
    anchorId: getAnchorId(directiveName, reflection.kind),
    children: children.length > 0 ? children : undefined,
    codeExample,
    codeExampleLanguage,
    deprecationReason,
    description,
    docsId: docsId ?? directiveName,
    extraTags,
    filePath,
    isDeprecated,
    isInternal,
    isPreview,
    kind,
    name: directiveName,
    repoUrl,
    selector: getSelector(reflection),
  };

  return directive;
}
