import { joinPathFragments, workspaceRoot } from '@nx/devkit';
import { updateJsonFile } from '@nx/workspace';

import { SpawnOptions } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { readJSONSync } from 'fs-extra';
import { format } from 'prettier';
import { parse } from 'semver';

import { runCommand } from './utils/spawn';

async function skyuxDevCommand(
  args: string[],
  spawnOptions: SpawnOptions,
): Promise<string | void> {
  return runCommand(`npx`, [`skyux-dev`, ...args], spawnOptions);
}

(async () => {
  const packageJsonFile = joinPathFragments(workspaceRoot, 'package.json');
  const startVersion = readJSONSync(packageJsonFile).version;
  try {
    updateJsonFile(packageJsonFile, (json) => {
      const version = parse(json.version);
      if (version) {
        // Create a similar version number that is not already published, with the same prerelease value.
        json.version = `${version.major}.${version.minor}.${version.patch + 1000}`;
        if (version.prerelease.length) {
          json.version += `-${version.prerelease.join('.')}`;
        }
      }
      return json;
    });
    await skyuxDevCommand([`create-packages-dist`], {
      cwd: workspaceRoot,
    });

    const localRepo = '//localhost:4873/';

    const npmConfig = [
      [`@skyux:registry`, `http:${localRepo}`],
      [`@skyux-sdk:registry`, `http:${localRepo}`],
      [`registry`, `http:${localRepo}`],
      // Having an auth token is required for publishing to a local registry, even if it's not used.
      [`${localRepo}:_authToken`, `YXV0aFRva2Vu`],
    ];

    const env = {
      ...process.env,
      ...Object.fromEntries(
        npmConfig.map(([key, value]) => [`npm_config_${key}`, value]),
      ),
    };

    await skyuxDevCommand([`publish-packages-dist`, '--skipRegistryConfig'], {
      cwd: workspaceRoot,
      env,
    });

    console.log('');
    console.log('Local packages published');
    console.log('');
  } finally {
    updateJsonFile(packageJsonFile, (json) => {
      json.version = startVersion;
      return json;
    });
    writeFileSync(
      packageJsonFile,
      await format(readFileSync(packageJsonFile, 'utf-8'), {
        parser: 'json',
      }),
    );
  }
})();
