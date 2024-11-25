import { ProjectReflection, Reflection } from 'typedoc';

export function getNearestProjectReflection(
  reflection: Reflection | undefined,
): ProjectReflection {
  while (reflection && !reflection.isProject()) {
    reflection = reflection.parent;
  }

  if (reflection) {
    return reflection;
  }

  /* istanbul ignore next: safety check */
  throw new Error('Could not find a ProjectReflection!');
}

export function findReflectionByName(
  name: string,
  projectReflection: ProjectReflection,
): Reflection | undefined {
  const children = projectReflection.children;

  if (children) {
    for (const child of children) {
      const found = child.getChildByName(name);

      /* istanbul ignore else: safety check */
      if (found) {
        return found;
      }
    }
  }

  /* istanbul ignore next: safety check */
  return;
}
