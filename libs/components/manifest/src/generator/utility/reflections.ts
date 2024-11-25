import { ProjectReflection, Reflection } from 'typedoc';

export function getNearestProjectReflection(
  reflection: Reflection | undefined,
): ProjectReflection {
  while (reflection && !reflection.isProject()) {
    reflection = reflection.parent;
  }

  if (!reflection) {
    throw new Error('Could not find a ProjectReflection!');
  }

  return reflection;
}

export function findReflectionByName(
  name: string,
  projectReflection: ProjectReflection,
): Reflection | undefined {
  for (const child of projectReflection?.children ?? []) {
    const found = child.getChildByName(name);

    if (found) {
      return found;
    }
  }

  return;
}
