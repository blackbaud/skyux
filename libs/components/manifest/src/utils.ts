import type { SkyManifestParentDefinition } from './types/base-def';
import type { SkyManifestDirectiveDefinition } from './types/directive-def';
import { SkyManifestFunctionDefinition } from './types/function-def';
import { SkyManifestPipeDefinition } from './types/pipe-def';

/**
 * Whether the provided definition is a directive definition.
 * @internal
 */
export function isDirectiveDefinition(
  def: SkyManifestParentDefinition,
): def is SkyManifestDirectiveDefinition {
  return def.kind === 'component' || def.kind === 'directive';
}

export function isPipeDefinition(
  def: SkyManifestParentDefinition,
): def is SkyManifestPipeDefinition {
  return def.kind === 'pipe';
}

export function isFunctionDefinition(
  def: SkyManifestParentDefinition,
): def is SkyManifestFunctionDefinition {
  return def.kind === 'function';
}
