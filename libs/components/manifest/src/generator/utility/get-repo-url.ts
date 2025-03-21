import { DeclarationReflection } from 'typedoc';

const DEFAULT_REPO_URL = 'https://github.com/blackbaud/skyux';

export function getRepoUrl(reflection: DeclarationReflection): string {
  let repoUrl = reflection.sources?.[0].url;

  /* v8 ignore start: safety check */
  if (!repoUrl) {
    console.warn(
      `  [!] A repo URL could not be determined for type "${reflection.escapedName}". ` +
        `This warning will likely go away once this type is pushed to a branch on the origin.`,
    );

    repoUrl = DEFAULT_REPO_URL;
  }
  /* v8 ignore stop */

  return repoUrl;
}
