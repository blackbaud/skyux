import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { getPublicApi } from './get-public-api';

interface SkyManifestOptions {
  outDir: string;
}

export async function generateManifest(
  options: SkyManifestOptions,
): Promise<void> {
  const publicApi = await getPublicApi();

  const outDir = path.normalize(options.outDir);

  if (!fs.existsSync(outDir)) {
    await fsPromises.mkdir(outDir);
  }

  const publicApiPath = path.join(outDir, 'public-api.json');

  await fsPromises.writeFile(publicApiPath, JSON.stringify(publicApi));

  process.stderr.write(`\nCreated ${publicApiPath}.\n`);
}
