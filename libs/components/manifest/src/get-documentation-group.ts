import codeExamplesJson from '../code-examples.json';
import documentationConfigJson from '../documentation-config.json';

import { getPublicApi } from './get-public-api';
import {
  SkyManifestDocumentationConfig,
  SkyManifestDocumentationGroupConfig,
} from './types/documentation-config';
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

function removeInternalTypes(
  defs: SkyManifestDocumentationTypeDefinition[],
): SkyManifestDocumentationTypeDefinition[] {
  const filtered = defs.filter((def) => !def.isInternal);

  for (const def of filtered) {
    if (def.children) {
      def.children = def.children.filter((child) => !child.isInternal);
    }
  }

  return filtered;
}

function getPublicApiByDocsIds(
  config: SkyManifestDocumentationGroupConfig,
): SkyManifestDocumentationGroup {
  const codeExamples = config.codeExamples.docsIds.map(
    (docsId) => CODE_EXAMPLES.examples[docsId],
  );

  const packageInfo = getGroupPackageInfo(config.development.primaryDocsId);

  const publicApi = removeInternalTypes(
    config.development.docsIds.map((docsId) => getDefinitionByDocsId(docsId)),
  );

  const testing = removeInternalTypes(
    config.testing.docsIds.map((docsId) => getDefinitionByDocsId(docsId)),
  );

  const documentation: SkyManifestDocumentationGroup = {
    codeExamples,
    packageInfo,
    publicApi,
    testing,
  };

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

  return getPublicApiByDocsIds(group);
}
