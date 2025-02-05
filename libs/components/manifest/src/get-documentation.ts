import codeExamplesJson from '../code-examples.json';
import documentationConfigJson from '../documentation-config.json';

import { getPublicApi } from './get-public-api';
import { SkyManifestDocumentationConfig } from './types/documentation-config';
import type {
  SkyManifestCodeExamples,
  SkyManifestDocumentation,
} from './types/manifest';

const PUBLIC_API = getPublicApi();
const DOCS_CONFIG = documentationConfigJson as SkyManifestDocumentationConfig;
const CODE_EXAMPLES = codeExamplesJson as SkyManifestCodeExamples;

function filterPublicApiForDocumentation(
  docsIds: string[],
): SkyManifestDocumentation {
  const documentation: SkyManifestDocumentation = {
    codeExamples: [],
    publicApi: [],
    testing: [],
  };

  for (const [packageName, definitions] of Object.entries(
    PUBLIC_API.packages,
  )) {
    for (const definition of definitions) {
      if (docsIds.includes(definition.docsId)) {
        if (packageName === '@skyux/code-examples') {
          documentation.codeExamples.push(
            CODE_EXAMPLES.examples[definition.docsId],
          );
        } else if (packageName.endsWith('/testing')) {
          documentation.testing.push({ ...definition, packageName });
        } else {
          documentation.publicApi.push({ ...definition, packageName });
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
 * @returns
 */
export function getDocumentation(
  packageName: string,
  groupName: string,
): SkyManifestDocumentation {
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

  return filterPublicApiForDocumentation(group.docsIds);
}
