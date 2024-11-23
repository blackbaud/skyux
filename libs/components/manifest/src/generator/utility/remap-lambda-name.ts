import { type DeclarationReflection } from 'typedoc';

export function remapLambdaName(reflection: DeclarationReflection): string {
  if (reflection.name.startsWith('λ')) {
    return reflection.escapedName as string;
  }

  return reflection.name;
}
