import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type { SkyManifestDocumentationConfig } from '../types/documentation-config';
import type { SkyManifestPublicApi } from '../types/manifest';

import { getDocumentationConfig } from './get-documentation-config';
import { getProjectDefinitions } from './get-project-definitions';
import { getPublicApi } from './get-public-api';

interface SkyManifestOptions {
  outDir: string;
  projectNames: string[];
  projectsRootDirectory: string;
}

async function ensureDirectory(directoryPath: string): Promise<void> {
  if (!fs.existsSync(directoryPath)) {
    await fsPromises.mkdir(directoryPath);
  }
}

async function writeManifestFiles(
  outDir: string,
  publicApi: SkyManifestPublicApi,
  documentationConfig: SkyManifestDocumentationConfig,
): Promise<void> {
  const publicApiPath = path.join(outDir, 'public-api.json');
  const documentationConfigPath = path.join(
    outDir,
    'documentation-config.json',
  );

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

  console.log(`Created ${documentationConfigPath}\n`);
}

/**
 * Generates manifest files for the distribution build.
 * (This function is executed by the postbuild script.)
 */
export async function generateManifest(
  options: SkyManifestOptions,
): Promise<{ publicApi: SkyManifestPublicApi }> {
  const projects = getProjectDefinitions(
    options.projectsRootDirectory,
    options.projectNames,
  );

  const publicApi = await getPublicApi(projects);
  const documentationConfig = await getDocumentationConfig(publicApi, projects);

  const outDir = path.normalize(options.outDir);

  await writeManifestFiles(outDir, publicApi, documentationConfig);

  return { publicApi };
}
