import { ProjectReflection, Reflection } from 'typedoc';

/**
 * Gets the nearest project reflection ancestor of the given reflection.
 */
export function getNearestProjectReflection(
  reflection: Reflection | undefined,
): ProjectReflection {
  while (reflection && !reflection.isProject()) {
    reflection = reflection.parent;
  }

  if (reflection) {
    return reflection;
    /* v8 ignore start: else branch safety check */
  }

  throw new Error('Could not find a ProjectReflection!');
}
/* v8 ignore stop */

/**
 * Gets a reflection by name from a project reflection.
 * (This function assumes the TypeDoc setting `alwaysCreateEntryPointModule` is
 * set to `true`.)
 */
export function findReflectionByName(
  name: string,
  projectReflection: ProjectReflection,
): Reflection | undefined {
  const children = projectReflection.children;

  if (children) {
    for (const child of children) {
      const found = child.getChildByName(name);

      if (found) {
        return found;
        /* v8 ignore start: else branch safety check */
      }
    }
  }

  return;
}
/* v8 ignore stop */
