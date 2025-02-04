import Ajv from 'ajv';
import glob from 'fast-glob';
import fsExtra from 'fs-extra';
import minimist from 'minimist';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import documentationSchema from '../libs/components/manifest/documentation-schema.json';
import { generateManifest } from '../libs/components/manifest/src/generator/generate-manifest';
import {
  SkyManifestParentDefinition,
  SkyManifestPublicApi,
} from '../libs/components/manifest/src/index';

import { runCommand } from './utils/spawn';

const argv = minimist(process.argv.slice(2));
const ajv = new Ajv();
const validateSchema = ajv.compile(documentationSchema);

/**
 * Writes the current snapshot of deprecated features to a file.
 */
async function writeSnapshot(
  snapshotPath: string,
  snapshot: string[],
): Promise<void> {
  await fsPromises.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));
}

/**
 * Whether the current version is a prerelease.
 */
async function isPrerelease(): Promise<boolean> {
  const thisPackageJson = JSON.parse(
    await fsPromises.readFile(
      path.resolve(__dirname, '../package.json'),
      'utf-8',
    ),
  );

  return thisPackageJson.version.includes('-');
}

/**
 * Creates a snapshot of the currently deprecated features of the public API.
 */
function createDeprecationsSnapshot(publicApi: SkyManifestPublicApi): string[] {
  const deprecations: string[] = [];

  for (const [packageName, definitions] of Object.entries(publicApi.packages)) {
    for (const definition of definitions) {
      if (definition.isDeprecated) {
        deprecations.push(`${packageName}:${definition.name}`);
      }

      if (definition.children) {
        definition.children?.forEach((child) => {
          if (child.isDeprecated) {
            deprecations.push(
              `${packageName}:${definition.name}:${child.name}`,
            );
          }
        });
      }
    }
  }

  return deprecations.sort();
}

/**
 * Validates that the public API does not include newly deprecated features in
 * a minor version release.
 */
async function checkManifest({
  publicApi,
}: {
  publicApi: SkyManifestPublicApi;
}): Promise<void> {
  const snapshotDirectory = path.join(__dirname, '__snapshots__');
  const snapshotPath = path.join(snapshotDirectory, 'deprecations.json');

  await fsExtra.ensureDir(snapshotDirectory);

  const snapshot = createDeprecationsSnapshot(publicApi);

  if (!fs.existsSync(snapshotPath) || argv['update-deprecations-snapshot']) {
    await writeSnapshot(snapshotPath, snapshot);
  } else {
    const previousDeprecations = JSON.parse(
      await fsPromises.readFile(snapshotPath, 'utf-8'),
    ) as string[];

    const newDeprecations = snapshot.filter(
      (feature) => !previousDeprecations.includes(feature),
    );

    if (newDeprecations.length > 0) {
      if (await isPrerelease()) {
        throw new Error(
          'New deprecations detected in a prerelease. Run `npm run dev:update-deprecations-snapshot` and commit the results with your changes.',
        );
      } else {
        throw new Error(
          'Features from the public API cannot be marked deprecated during a ' +
            'minor version release. Undo the following deprecations or wait ' +
            `for a major version pre-release:\n ${newDeprecations.join('\n ')}.`,
        );
      }
    } else {
      const removedDeprecations = previousDeprecations.filter(
        (feature) => !snapshot.includes(feature),
      );

      if (removedDeprecations.length > 0) {
        await writeSnapshot(snapshotPath, snapshot);
      }
    }
  }
}

function getDefinitionByDocsId(
  docsId: string,
  packages: Record<string, SkyManifestParentDefinition[]>,
): SkyManifestParentDefinition | undefined {
  for (const definitions of Object.values(packages)) {
    for (const definition of definitions) {
      if (definition.docsId === docsId) {
        return definition;
      }
    }
  }

  return;
}

// TODO: PUT THIS IN THE MANIFEST SO IT CAN BE UNIT TESTED!
async function validateDocumentation({
  publicApi,
}: {
  publicApi: SkyManifestPublicApi;
}): Promise<void> {
  const documentationConfigs = await glob(
    'libs/components/**/documentation.json',
  );

  // Is every docsId pointing to a valid, non-internal type?
  for (const configFile of documentationConfigs) {
    const contents = await fsExtra.readJson(path.normalize(configFile));

    if (!validateSchema(contents)) {
      throw new Error(`Schema validation failed for ${configFile}`);
    }

    const groups = contents['groups'] as Record<
      string,
      { docsIds: string[]; primaryDocsId: string }
    >;

    for (const [groupName, config] of Object.entries(groups)) {
      for (const docsId of config.docsIds) {
        const definition = getDefinitionByDocsId(docsId, publicApi.packages);

        if (!definition) {
          throw new Error(
            `The @docsId "${docsId}" referenced by "${groupName}" is not recognized.`,
          );
        }

        if (definition.isInternal) {
          throw new Error(
            `The @docsId "${docsId}" referenced by "${groupName}" is not included in the public API.`,
          );
        }
      }

      if (!config.docsIds.includes(config.primaryDocsId)) {
        throw new Error(
          `The value for primaryDocsId ("${config.primaryDocsId}") must be included in the docsIds array for group "${groupName}" (current: ${config.docsIds.join(', ')}).`,
        );
      }
    }
  }
}

void (async (): Promise<void> => {
  let projectNames: string[] = [];

  try {
    const output = await runCommand(
      'npx',
      ['nx', 'show', 'projects', '--projects', 'tag:component', '--json'],
      { stdio: 'pipe' },
    );

    if (output) {
      projectNames = JSON.parse(output);
    } else {
      throw new Error('Project names could not be determined.');
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  const manifest = await generateManifest({
    outDir: 'dist/libs/components/manifest',
    projectNames,
    projectsRootDirectory: 'libs/components/',
  });

  await checkManifest(manifest);
  await validateDocumentation(manifest);
})();
