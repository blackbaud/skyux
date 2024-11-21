import { generateManifest } from '../libs/components/manifest/src/generator/generate-manifest';

(async (): Promise<void> => {
  await generateManifest({
    outDir: 'dist/libs/components/manifest',
  });
})();
