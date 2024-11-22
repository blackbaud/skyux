import { generateManifest } from '../libs/components/manifest/src/generator/generate-manifest';
import {
  SkyManifestPublicApi,
  getDeprecatedTemplateFeatures,
} from '../libs/components/manifest/src/index';

async function checkManifest(publicApi: SkyManifestPublicApi): Promise<void> {
  const deprecations = getDeprecatedTemplateFeatures(publicApi);

  console.log('eh?', deprecations);

  // const snapshotPath = path.join(
  //   __dirname,
  //   '__snapshots__',
  //   'deprecations.json',
  // );

  // const currentDeprecations: DeprecationsSnapshot = (fs.existsSync(snapshotPath)) ? JSON.parse(await fsPromises.readFile(snapshotPath, 'utf-8')) : {templateFeatures: []};

  // const packageEntries = Object.entries(publicApi.packages) as [
  //   string,
  //   SkyManifestDefinition[],
  // ][];

  // const oldDeprecationsCount = parseInt(
  //   (await fsPromises.readFile(snapshotPat, 'utf-8')).trim(),
  //   10,
  // );

  // if (deprecationsCount > oldDeprecationsCount) {
  //   throw new Error(
  //     `Deprecations count increased from ${oldDeprecationsCount} to ${deprecationsCount}. Types exported by the public API cannot be deprecated in a minor version.`,
  //   );
  // }
}

(async (): Promise<void> => {
  const manifest = await generateManifest({
    outDir: 'dist/libs/components/manifest',
    projectsDirectory: 'libs/components/',
  });

  await checkManifest(manifest.publicApi);
})();
