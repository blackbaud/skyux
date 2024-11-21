import fs from 'node:fs';
import fsPromises from 'node:fs/promises';

import { PackagesMap, getPublicApi } from './get-public-api';
import { sortMapByKey, toObject } from './utility/maps';

async function writeJsonFiles(publicApi: PackagesMap): Promise<void> {
  await fsPromises.writeFile(
    `manifests/public-api.json`,
    JSON.stringify(toObject(sortMapByKey(publicApi)), undefined, 2),
  );

  // await fsPromises.writeFile(
  //   `manifests/template-features.json`,
  //   JSON.stringify(templateFeatures, undefined, 2),
  // );
}

// function getTemplateFeatures(
//   publicApi: PackagesMap,
// ): SkyManifestTemplateFeatures {
//   const templateFeatures: SkyManifestTemplateFeatures = {
//     packages: {},
//   };

//   for (const [packageName, types] of publicApi) {
//     if (packageName.endsWith('/testing')) {
//       continue;
//     }

//     templateFeatures.packages[packageName] = {
//       directives: [],
//       pipes: [],
//     };

//     for (const t of types) {
//       if (t.kind === 'directive' || t.kind === 'component') {
//         const directive = t as SkyManifestDirectiveDefinition;
//         templateFeatures.packages[packageName].directives.push({
//           selector: directive.selector,
//           inputs: directive.inputs.map((i) => i.name),
//           outputs: directive.outputs.map((o) => o.name),
//         });
//       } else if (t.kind === 'pipe') {
//         templateFeatures.packages[packageName].pipes.push({
//           name: t.name,
//         });
//       }
//     }
//   }

//   return templateFeatures;
// }

(async (): Promise<void> => {
  if (fs.existsSync('manifests')) {
    await fsPromises.rm('manifests', { recursive: true });
  }

  await fsPromises.mkdir('manifests');

  const publicApi = await getPublicApi();

  // const deprecated = getDeprecated(publicApi);

  // const templateFeatures = getTemplateFeatures(publicApi);

  await writeJsonFiles(publicApi);
})();
