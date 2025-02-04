import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type { SkyManifestPublicApi } from '../types/manifest';

import { getDocumentation } from './get-documentation';
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
): Promise<void> {
  const publicApiPath = path.join(outDir, 'public-api.json');

  await ensureDirectory(outDir);
  await fsPromises.writeFile(
    publicApiPath,
    JSON.stringify(publicApi, undefined, 2),
  );

  console.log(`\nCreated ${publicApiPath}.\n`);
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
  await getDocumentation(publicApi, projects);

  const outDir = path.normalize(options.outDir);

  await writeManifestFiles(outDir, publicApi);

  return { publicApi };
}
