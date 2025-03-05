import codeExamplesJson from '../code-examples.json';
import documentationConfigJson from '../documentation-config.json';

import { getPublicApi } from './get-public-api';
import { SkyManifestDocumentationConfig } from './types/documentation-config';
import type {
  SkyManifestCodeExamples,
  SkyManifestDocumentationGroup,
  SkyManifestDocumentationGroupPackageInfo,
  SkyManifestDocumentationTypeDefinition,
} from './types/manifest';

const PUBLIC_API = getPublicApi();
const DOCS_CONFIG = documentationConfigJson as SkyManifestDocumentationConfig;
const CODE_EXAMPLES = codeExamplesJson as SkyManifestCodeExamples;

function getGroupPackageInfo(
  primaryDocsId: string,
): SkyManifestDocumentationGroupPackageInfo {
  const { packageName, repoUrl } = getDefinitionByDocsId(primaryDocsId);

  return {
    packageName,
    registryUrl: `https://www.npmjs.com/package/${packageName}`,
    repoUrl,
  } satisfies SkyManifestDocumentationGroupPackageInfo;
}

function getDefinitionByDocsId(
  docsId: string,
): SkyManifestDocumentationTypeDefinition {
  for (const [packageName, definitions] of Object.entries(
    PUBLIC_API.packages,
  )) {
    for (const definition of definitions) {
      if (definition.docsId === docsId) {
        return { ...definition, packageName };
      }
    }
  }

  throw new Error(
    `Failed to retrieve type definition with docsId "${docsId}".`,
  );
}

function getPublicApiByDocsIds(
  docsIds: string[],
  primaryDocsId: string,
): SkyManifestDocumentationGroup {
  const documentation: SkyManifestDocumentationGroup = {
    codeExamples: [],
    packageInfo: getGroupPackageInfo(primaryDocsId),
    publicApi: [],
    testing: [],
  };

  for (const docsId of docsIds) {
    const definition = getDefinitionByDocsId(docsId);

    if (definition.docsId === docsId) {
      if (definition.packageName === '@skyux/code-examples') {
        documentation.codeExamples.push(
          CODE_EXAMPLES.examples[definition.docsId],
        );
      } else if (definition.packageName.endsWith('/testing')) {
        documentation.testing.push(definition);
      } else {
        documentation.publicApi.push(definition);
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

  return getPublicApiByDocsIds(group.docsIds, group.primaryDocsId);
}
