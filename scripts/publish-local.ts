import { workspaceRoot } from '@nx/devkit';

import { SpawnOptions } from 'child_process';

import { runCommand } from './utils/spawn';

async function skyuxDevCommand(
  args: string[],
  spawnOptions: SpawnOptions,
): Promise<string | void> {
  return runCommand(`npx`, [`skyux-dev`, ...args], spawnOptions);
}

(async () => {
  await skyuxDevCommand([`create-packages-dist`], {
    cwd: workspaceRoot,
  });

  const localRepo = '//localhost:4873/';

  const npmConfig = [
    [`@skyux:registry`, `http:${localRepo}`],
    [`@skyux-sdk:registry`, `http:${localRepo}`],
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
})();
