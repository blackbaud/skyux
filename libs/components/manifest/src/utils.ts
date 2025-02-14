import type {
  SkyManifestParentDefinition,
  SkyManifestParentDefinitionKind,
} from './types/base-def';
import { SkyManifestClassDefinition } from './types/class-def';
import type { SkyManifestDirectiveDefinition } from './types/directive-def';

/**
 * Whether the provided definition is a directive definition.
 * @internal
 */
export function isDirectiveDefinition(
  def: SkyManifestParentDefinition,
): def is SkyManifestDirectiveDefinition {
  return def.kind === 'component' || def.kind === 'directive';
}

export function isClassDefinition(
  def: SkyManifestParentDefinition,
): def is SkyManifestClassDefinition {
  const classKinds: SkyManifestParentDefinitionKind[] = [
    'class',
    'module',
    'pipe',
    'service',
  ];

  return classKinds.includes(def.kind);
}
