import type {
  SkyManifestDocumentationConfig,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { getDocumentationConfig } from './get-documentation-config.js';
import { getProjectDefinitions } from './get-project-definitions.js';
import { getPublicApi } from './get-public-api.js';
import { SkyManifestOptions } from './manifest-options.js';
import { ensureDirectory, getOutputPaths } from './utility/get-output-paths.js';

async function writeManifestFiles(
  outDir: string,
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
): Promise<void> {
  const { publicApiPath, documentationConfigPath } = getOutputPaths(outDir);

  await ensureDirectory(outDir);

  await fsPromises.writeFile(
    publicApiPath,
    JSON.stringify(publicApi, undefined, 2),
  );

  console.log(`\nCreated ${publicApiPath}`);

  await fsPromises.writeFile(
    documentationConfigPath,
    JSON.stringify(documentationConfig, undefined, 2),
  );

  console.log(`Created ${documentationConfigPath}`);
}

/**
 * Generates manifest files for the distribution build.
 * (This function is executed by the manifest build script.)
 */
export async function generateManifest(
  options: SkyManifestOptions,
): Promise<{ publicApi: SkyManifestPublicApi }> {
  const projects = getProjectDefinitions(
    options.projectsRootDirectory,
    options.projectNames,
  );

  const [publicApi, publicApiErrors] = await getPublicApi(projects);

  const [documentationConfig, documentationConfigErrors] =
    await getDocumentationConfig(publicApi, projects);

  const errors = [...publicApiErrors, ...documentationConfigErrors];

  if (errors.length > 0) {
    throw new Error(
      'The following errors were encountered when creating the manifest:\n - ' +
        errors.join('\n - '),
    );
  }

  const outDir = path.normalize(options.outDir);

  await writeManifestFiles(outDir, publicApi, documentationConfig);

  return { publicApi };
}
