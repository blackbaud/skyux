import type {
  SkyManifestCodeExamples,
  SkyManifestDocumentationConfig,
  SkyManifestPublicApi,
} from '@skyux/manifest-local';

import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { getCodeExamples } from './get-code-examples.js';
import { getDocumentationConfig } from './get-documentation-config.js';
import { getProjectDefinitions } from './get-project-definitions.js';
import { getPublicApi } from './get-public-api.js';

interface SkyManifestOptions {
  codeExamplesPackageName: string;
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
): Promise<void> {
  const publicApiPath = path.join(outDir, 'public-api.json');
  const documentationConfigPath = path.join(
    outDir,
    'documentation-config.json',
  );
  const codeExamplesPath = path.join(outDir, 'code-examples.json');

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

  console.log(`Created ${codeExamplesPath}\n`);
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
    options.codeExamplesPackageName,
  );

  const errors = [
    ...publicApiErrors,
    ...documentationConfigErrors,
    ...codeExamplesErrors,
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
  );

  return { publicApi };
}
