import {
  SkyManifestDefinition,
  SkyManifestDirectiveDefinition,
} from './types/manifest.js';

export function isTemplateFeature(def: SkyManifestDefinition): boolean {
  return (
    def.kind === 'directive' || def.kind === 'component' || def.kind === 'pipe'
  );
}

export function isDirectiveDefinition(
  def: SkyManifestDefinition,
): def is SkyManifestDirectiveDefinition {
  return def.kind === 'component' || def.kind === 'directive';
}
