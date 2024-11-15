import { glob } from 'glob';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

async function findPackagesMetadata(): Promise<void> {
  // const files = await glob('dist/libs/components/*/documentation.json');
  // if (files.length === 0) {
  //   throw new Error(
  //     'No documentation.json files found. ' +
  //       'Did you run `npx skyux-dev create-packages-dist`?',
  //   );
  // }
  // for (const file of files) {
  //   const json = JSON.parse(
  //     await readFile(path.normalize(file), { encoding: 'utf-8' }),
  //   );
  //   for (const docs of json.typedoc.children) {
  //   }
  // }
}

findPackagesMetadata();
