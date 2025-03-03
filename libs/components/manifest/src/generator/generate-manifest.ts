import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import type { SkyManifestDocumentationConfig } from '../types/documentation-config';
import type {
  SkyManifestCodeExamples,
  SkyManifestPublicApi,
} from '../types/manifest';

import { getCodeExamples } from './get-code-examples';
import { getDocumentationConfig } from './get-documentation-config';
import { SkyManifestPackagesInfo, getPackagesInfo } from './get-packages-info';
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
  codeExamples: SkyManifestCodeExamples,
  packagesInfo: SkyManifestPackagesInfo,
): Promise<void> {
  const publicApiPath = path.join(outDir, 'public-api.json');
  const documentationConfigPath = path.join(
    outDir,
    'documentation-config.json',
  );
  const codeExamplesPath = path.join(outDir, 'code-examples.json');
  const packagesInfoPath = path.join(outDir, 'packages-info.json');

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

  await fsPromises.writeFile(
    codeExamplesPath,
    JSON.stringify(codeExamples, undefined, 2),
  );

  console.log(`Created ${codeExamplesPath}`);

  await fsPromises.writeFile(
    packagesInfoPath,
    JSON.stringify(packagesInfo, undefined, 2),
  );

  console.log(`Created ${packagesInfoPath}`);
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

  const [publicApi, publicApiErrors] = await getPublicApi(projects);

  const [documentationConfig, documentationConfigErrors] =
    await getDocumentationConfig(publicApi, projects);

  const [codeExamples, codeExamplesErrors] = await getCodeExamples(
    publicApi,
    documentationConfig,
  );

  const [packagesInfo, packagesInfoErrors] = await getPackagesInfo(publicApi);

  const errors = [
    ...publicApiErrors,
    ...documentationConfigErrors,
    ...codeExamplesErrors,
    ...packagesInfoErrors,
  ];

  if (errors.length > 0) {
    throw new Error(
      'The following errors were encountered when creating the manifest:\n - ' +
        errors.join('\n - '),
    );
  }

  const outDir = path.normalize(options.outDir);

  await writeManifestFiles(
    outDir,
    publicApi,
    documentationConfig,
    codeExamples,
    packagesInfo,
  );

  return { publicApi };
}
