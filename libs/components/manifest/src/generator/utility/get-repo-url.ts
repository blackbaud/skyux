import { DeclarationReflection } from 'typedoc';

export function getRepoUrl(reflection: DeclarationReflection): string {
  const repoUrl = reflection.sources?.[0].url;

  if (!repoUrl) {
    throw new Error(
      `A repo URL could not be determined for type "${reflection.escapedName}".`,
    );
  }

  return repoUrl;
}
