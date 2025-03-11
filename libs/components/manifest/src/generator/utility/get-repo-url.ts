import { DeclarationReflection } from 'typedoc';

export function getRepoUrl(reflection: DeclarationReflection): string {
  const repoUrl =
    reflection.sources?.[0].url ?? 'https://github.com/blackbaud/skyux';

  /* istanbul ignore if: safety check */
  if (!repoUrl) {
    throw new Error(
      `A repo URL could not be determined for type "${reflection.escapedName}".`,
    );
  }

  return repoUrl;
}
