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

  const manifestFilePath = path.resolve(__dirname, '../manifest.ts');
  // const originalManifest = await fsPromises.readFile(manifestFilePath, 'utf-8');

  await fsPromises.writeFile(
    manifestFilePath,
    `import { SkyManifest } from './types/manifest';

export const manifest: SkyManifest = {
  publicApi: {
    packages: ${JSON.stringify(Object.fromEntries(publicApi.packages))},
  },
};
`,
  );
  // await fsPromises.writeFile(
  //   path.join(outDir, 'public-api.json'),
  //   JSON.stringify(Object.fromEntries(publicApi.packages)),
  // );
}
