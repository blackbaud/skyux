import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';

import { getPublishableProjects } from './lib/get-publishable-projects';
import { getDistTags } from './utils/npm-utils';
import { runCommand } from './utils/spawn';

async function createNpmrcFile(
  distRoot: string,
  npmToken: string
): Promise<void> {
  const npmFilePath = path.join(distRoot, '.npmrc');

  await fs.ensureFile(npmFilePath);
  await fs.writeFile(
    npmFilePath,
    `//registry.npmjs.org/:_authToken=${npmToken}`
  );
}

async function publishNpmPackages(): Promise<void> {
  try {
    if (!process.env.NPM_TOKEN) {
      throw new Error(
        'Environment variable "NPM_TOKEN" not set! Abort publishing to NPM.'
      );
    }

    const npmToken: string = process.env.NPM_TOKEN!;

    const version = (
      await fs.readJson(path.join(process.cwd(), 'package.json'))
    ).version;

    const distTags = await getDistTags('@skyux/core');

    const semverData = semver.parse(version);
    const isPrerelease = semverData ? semverData.prerelease.length > 0 : false;

    let npmPublishTag;
    if (isPrerelease) {
      if (semver.gt(version, distTags.next)) {
        npmPublishTag = '--tag=next';
      }
    } else {
      if (semver.gt(version, distTags.latest)) {
        npmPublishTag = '--tag=latest';
      }
    }

    const commandArgs = ['publish', '--access', 'public'];

    if (npmPublishTag) {
      commandArgs.push(npmPublishTag);
    }

    console.log(`

==============================================================
 > Run: npm ${commandArgs.join(' ')}
==============================================================

`);

    const distPackages = await getPublishableProjects();

    for (const projectName in distPackages) {
      const distRoot = path.join(
        process.cwd(),
        distPackages[projectName].distRoot!
      );

      await createNpmrcFile(distRoot, npmToken);

      await runCommand('npm', commandArgs, {
        cwd: distRoot,
        stdio: 'inherit',
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

publishNpmPackages();
