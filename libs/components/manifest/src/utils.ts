import type { SkyManifestParentDefinition } from './types/base-def';
import type { SkyManifestDirectiveDefinition } from './types/directive-def';

/**
 * Whether the provided definition is a directive definition.
 */
export function isDirectiveDefinition(
  def: SkyManifestParentDefinition,
): def is SkyManifestDirectiveDefinition {
  return def.kind === 'component' || def.kind === 'directive';
}
