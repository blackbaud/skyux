import { SpawnOptions } from 'child_process';
import crossSpawn from 'cross-spawn';
import path from 'path';

/**
 * Executes a given command in a cross-platform child process.
 * If spawnOptions.stdio is set to 'pipe', the promise will return the command's output as a string.
 */
export async function runCommand(
  command: string,
  args: string[] = [],
  spawnOptions: SpawnOptions = {}
): Promise<string | void> {
  spawnOptions = {
    ...{
      stdio: 'inherit',
      cwd: path.resolve(process.cwd()),
    },
    ...spawnOptions,
  };

  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, spawnOptions);

    let output = '';
    if (child.stdout) {
      child.stdout.on('data', (x) => (output += x.toString()));
    }

    let error = '';
    if (child.stderr) {
      child.stderr.on('data', (x) => (error += x.toString()));
    }

    child.on('error', (error) => {
      console.error('[skyux:runCommand] error', error.message);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        if (output) {
          resolve(output.trim());
        } else {
          resolve();
        }
      } else {
        reject(new Error(error));
      }
    });
  });
}
