import { DeclarationReflection } from 'typedoc';

const DEFAULT_REPO_URL = 'https://github.com/blackbaud/skyux';

export function getRepoUrl(reflection: DeclarationReflection): string {
  let repoUrl = reflection.sources?.[0].url;

  if (!repoUrl) {
    repoUrl = DEFAULT_REPO_URL;
    console.warn(
      `A repo URL could not be determined for type "${reflection.escapedName}". ` +
        `Using the default repo URL '${DEFAULT_REPO_URL}'.`,
    );
  }

  return repoUrl;
}
