import {
  type SkyManifestDefinition,
  type SkyManifestDirectiveDefinition,
} from './types/manifest.js';

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
