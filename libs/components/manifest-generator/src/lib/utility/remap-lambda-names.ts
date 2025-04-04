import { DeclarationReflection, ProjectReflection } from 'typedoc';

import { findReflectionByName } from './reflections.js';

export function remapLambdaName(reflection: DeclarationReflection): string {
  if (reflection.name.startsWith('λ')) {
    return reflection.escapedName as string;
  }

  return reflection.name;
}

/**
 * Remaps lambda names (e.g. `λ1`, `λ2`, etc.) to their actual names.
 */
export function remapLambdaNames(
  value: string,
  project: ProjectReflection,
): string {
  const lambdaNames = value.match(/λ\d+/g) ?? [];

  if (lambdaNames.length > 0) {
    for (const lambdaName of lambdaNames) {
      const actual = findReflectionByName(lambdaName, project);

      if (actual instanceof DeclarationReflection) {
        const actualName = remapLambdaName(actual);

        console.warn(`  [!] Remapped \`${lambdaName}\` to \`${actualName}\`.`);

        value = value.replace(lambdaName, actualName);
        /* v8 ignore start: safety check */
      } else {
        throw new Error(`Could not find replacement for \`${lambdaName}\`!`);
      }
      /* v8 ignore stop */
    }
  }

  return value;
}
