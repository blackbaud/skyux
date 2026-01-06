import type { SkyManifestCodeExamples } from '@skyux/manifest-local';

import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { getCodeExamples } from './get-code-examples.js';
import { getDocumentationConfig } from './get-documentation-config.js';
import { getProjectDefinitions } from './get-project-definitions.js';
import { getPublicApi } from './get-public-api.js';
import { SkyManifestOptions } from './manifest-options.js';
import { ensureDirectory, getOutputPaths } from './utility/get-output-paths.js';

async function writeCodeExamplesManifestFile(
  outDir: string,
  codeExamples: SkyManifestCodeExamples,
): Promise<void> {
  const { codeExamplesPath } = getOutputPaths(outDir);

  await ensureDirectory(outDir);

  await fsPromises.writeFile(
    codeExamplesPath,
    JSON.stringify(codeExamples, undefined, 2),
  );

  console.log(`Created ${codeExamplesPath}\n`);
}

/**
 * Generates code example manifest file for the distribution build.
 * (This function is executed by the manifest postbuild script.)
 */
export async function generateCodeExamplesManifest(
  options: SkyManifestOptions,
): Promise<void> {
  const projects = getProjectDefinitions(
    options.projectsRootDirectory,
    options.projectNames,
  );

  // In order to pick up changes, we need to regenerate the public API rather than
  // importing it from the manifest build.
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
      'The following errors were encountered when creating the code examples manifest:\n - ' +
        errors.join('\n - '),
    );
  }

  const outDir = path.normalize(options.outDir);

  await writeCodeExamplesManifestFile(outDir, codeExamples);
}
