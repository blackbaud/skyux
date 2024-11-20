import fs from 'node:fs';
import fsPromises from 'node:fs/promises';

import { PackagesMap, getPublicApi } from './get-public-api';
import { sortMapByKey, toObject } from './utility/maps';

async function writeJsonFiles(publicApi: PackagesMap): Promise<void> {
  await fsPromises.writeFile(
    `manifests/public-api.json`,
    JSON.stringify(toObject(sortMapByKey(publicApi)), undefined, 2),
  );
}

(async (): Promise<void> => {
  if (fs.existsSync('manifests')) {
    await fsPromises.rm('manifests', { recursive: true });
  }

  await fsPromises.mkdir('manifests');

  const publicApi = await getPublicApi();

  // const deprecated = getDeprecated(publicApi);

  await writeJsonFiles(publicApi);
})();
