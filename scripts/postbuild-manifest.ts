import fsExtra from 'fs-extra';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { generateManifest } from '../libs/components/manifest/src/generator/generate-manifest';
import {
  SkyManifestPublicApi,
  SkyManifestTemplateFeatureDeprecations,
  getDeprecatedTemplateFeatures,
} from '../libs/components/manifest/src/index';

import { runCommand } from './utils/spawn';

interface DeprecationsSnapshot {
  templateFeatures: string[];
}

function removeWhitespace(str: string): string {
  return str.replace(/\s/g, '');
}

function getNewSnapshot(
  deprecations: SkyManifestTemplateFeatureDeprecations,
): DeprecationsSnapshot {
  const snapshot: DeprecationsSnapshot = {
    templateFeatures: [],
  };

  for (const component of deprecations.components.concat(
    deprecations.directives,
  )) {
    const selector = removeWhitespace(component.selector);

    if (component.isDeprecated) {
      snapshot.templateFeatures.push(selector);
    } else {
      component.properties?.forEach((property) => {
        snapshot.templateFeatures.push(
          `${selector}.${removeWhitespace(property.name)}`,
        );
      });
    }
  }

  for (const pipe of deprecations.pipes) {
    snapshot.templateFeatures.push(removeWhitespace(pipe.templateBindingName));
  }

  snapshot.templateFeatures.sort();

  return snapshot;
}

async function writeSnapshot(
  snapshotPath: string,
  snapshot: DeprecationsSnapshot,
): Promise<void> {
  await fsPromises.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));
}

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
 * Validates that the public API does not deprecate any template features during
 * a minor version release.
 */
async function checkManifest(publicApi: SkyManifestPublicApi): Promise<void> {
  const deprecations = getDeprecatedTemplateFeatures(publicApi);
  const snapshot = getNewSnapshot(deprecations);
  const snapshotDirectory = path.join(__dirname, '__snapshots__');
  const snapshotPath = path.join(
    snapshotDirectory,
    'deprecated-template-features.json',
  );

  await fsExtra.ensureDir(snapshotDirectory);

  if (!fs.existsSync(snapshotPath) || (await isPrerelease())) {
    await writeSnapshot(snapshotPath, snapshot);
  } else {
    const previousDeprecations = JSON.parse(
      await fsPromises.readFile(snapshotPath, 'utf-8'),
    ) as DeprecationsSnapshot;

    const newDeprecations = snapshot.templateFeatures.filter(
      (feature) => !previousDeprecations.templateFeatures.includes(feature),
    );

    if (newDeprecations.length > 0) {
      throw new Error(
        'Template features exported by the public API cannot be deprecated ' +
          'during a minor version. Undo the following deprecations or wait ' +
          `for a major version release: ${newDeprecations.join(', ')}.`,
      );
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
    console.error(err);
    process.exit(1);
  }

  const manifest = await generateManifest({
    outDir: 'dist/libs/components/manifest',
    projectNames,
    projectsRootDirectory: 'libs/components/',
  });

  await checkManifest(manifest.publicApi);
})();
