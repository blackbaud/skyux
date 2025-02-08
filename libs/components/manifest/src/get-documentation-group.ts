// import codeExamplesJson from '../code-examples.json';
import documentationConfigJson from '../documentation-config.json';

import { getPublicApi } from './get-public-api';
import { SkyManifestDocumentationConfig } from './types/documentation-config';
import type { SkyManifestDocumentationGroup } from './types/manifest';

const PUBLIC_API = getPublicApi();
const DOCS_CONFIG = documentationConfigJson as SkyManifestDocumentationConfig;
// const CODE_EXAMPLES = codeExamplesJson as SkyManifestCodeExamples;

function getPublicApiByDocsIds(
  docsIds: string[],
): SkyManifestDocumentationGroup {
  const documentation: SkyManifestDocumentationGroup = {
    codeExamples: [],
    publicApi: [],
    testing: [],
  };

  for (const docsId of docsIds) {
    for (const [packageName, definitions] of Object.entries(
      PUBLIC_API.packages,
    )) {
      for (const definition of definitions) {
        if (definition.docsId === docsId) {
          if (packageName === '@skyux/code-examples') {
            documentation.codeExamples.push({ ...definition, packageName });
          } else if (packageName.endsWith('/testing')) {
            documentation.testing.push({ ...definition, packageName });
          } else {
            documentation.publicApi.push({ ...definition, packageName });
          }
        }
      }
    }
  }

  return documentation;
}

/**
 * Returns information about the documentation for a group of types within an NPM package.
 * @param packageName The NPM package name.
 * @param groupName The documentation group name.
 * @internal
 */
export function getDocumentationGroup(
  packageName: string,
  groupName: string,
): SkyManifestDocumentationGroup {
  const config = DOCS_CONFIG.packages[packageName];

  if (!config) {
    throw new Error(
      `Documentation could not be found for the package "${packageName}".`,
    );
  }

  const group = config.groups[groupName];

  if (!group) {
    throw new Error(
      `Documentation exists for a package named "${packageName}", but it does not include a group with the name "${groupName}".`,
    );
  }

  return getPublicApiByDocsIds(group.docsIds);
}
