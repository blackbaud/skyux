import { SpawnOptions } from 'child_process';
import crossSpawn from 'cross-spawn';
import path from 'path';

export async function getCommandOutput(
  command: string,
  args: string[] = [],
  spawnOptions: SpawnOptions = {}
): Promise<string> {
  spawnOptions = {
    ...spawnOptions,
    ...{
      stdio: 'pipe', // <-- required to get output
    },
  };

  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, spawnOptions);

    let output = '';
    if (child.stdout) {
      child.stdout.on('data', (x) => (output += x));
    }

    child.on('error', (error) => {
      console.error(`[skyux:getCommandOutput] error: ${error.message}`);
      reject(error);
    });

    child.on('exit', () => {
      resolve(output.trim());
    });
  });
}

export async function runCommand(
  command: string,
  args: string[] = [],
  spawnOptions: SpawnOptions = {}
): Promise<void> {
  spawnOptions = {
    ...{
      stdio: 'inherit',
      cwd: path.resolve(process.cwd()),
    },
    ...spawnOptions,
  };

  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, spawnOptions);

    if (child.stdout) {
      child.stdout.on('data', (x) =>
        console.log('[skyux:runCommand] stdout:', x)
      );
    }

    if (child.stderr) {
      child.stderr.on('data', (x) =>
        console.error('[skyux:runCommand] stderr:', x)
      );
    }

    child.on('error', (error) => {
      console.error('[skyux:runCommand] error', error.message);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}
