import {
  type SkyManifestClassPropertyDefinition,
  type SkyManifestDefinition,
  type SkyManifestDirectiveDefinition,
  type SkyManifestPipeDefinition,
} from './types/manifest.js';

/**
 * Returns the combined list of inputs and outputs for a directive definition.
 */
export function getDirectiveInputsAndOutputs(
  definition: SkyManifestDirectiveDefinition,
): SkyManifestClassPropertyDefinition[] {
  return (definition.inputs ?? []).concat(definition.outputs ?? []);
}

export function isTemplateFeature(def: SkyManifestDefinition): boolean {
  return (
    def.kind === 'directive' || def.kind === 'component' || def.kind === 'pipe'
  );
}

/**
 * Whether the provided definition is a directive definition.
 */
export function isDirectiveDefinition(
  def: SkyManifestDefinition,
): def is SkyManifestDirectiveDefinition {
  return def.kind === 'component' || def.kind === 'directive';
}

/**
 * Whether the provided definition is a pipe definition.
 */
export function isPipeDefinition(
  def: SkyManifestDefinition,
): def is SkyManifestPipeDefinition {
  return def.kind === 'pipe';
}
