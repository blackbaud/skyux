import fsExtra from 'fs-extra';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { generateManifest } from '../libs/components/manifest/src/generator/generate-manifest';
import { SkyManifestPublicApi } from '../libs/components/manifest/src/index';

import { runCommand } from './utils/spawn';

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

  if (!fs.existsSync(snapshotPath) || (await isPrerelease())) {
    await writeSnapshot(snapshotPath, snapshot);
  } else {
    const previousDeprecations = JSON.parse(
      await fsPromises.readFile(snapshotPath, 'utf-8'),
    ) as string[];

    const newDeprecations = snapshot.filter(
      (feature) => !previousDeprecations.includes(feature),
    );

    if (newDeprecations.length > 0) {
      throw new Error(
        'Features from the public API cannot be marked deprecated during a ' +
          'minor version release. Undo the following deprecations or wait ' +
          `for a major version pre-release:\n ${newDeprecations.join('\n ')}.`,
      );
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

(async (): Promise<void> => {
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
})();
