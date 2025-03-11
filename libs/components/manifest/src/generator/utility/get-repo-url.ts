import { DeclarationReflection } from 'typedoc';

const DEFAULT_REPO_URL = 'https://github.com/blackbaud/skyux';

export function getRepoUrl(reflection: DeclarationReflection): string {
  let repoUrl = reflection.sources?.[0].url;

  /* istanbul ignore if: safety check */
  if (!repoUrl) {
    console.warn(
      `  [!] A repo URL could not be determined for type "${reflection.escapedName}". ` +
        `Using the default ${DEFAULT_REPO_URL}.`,
    );

    repoUrl = DEFAULT_REPO_URL;
  }

  return repoUrl;
}
