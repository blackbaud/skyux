import { type DeclarationReflection } from 'typedoc';

export function remapLambdaName(decl: DeclarationReflection): string {
  if (decl.name.startsWith('λ')) {
    return decl.escapedName as string;
  }

  return decl.name;
}
