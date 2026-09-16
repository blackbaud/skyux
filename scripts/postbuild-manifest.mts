import { generateCodeExamplesManifest } from '../libs/components/manifest-generator/src/index.js';

import { getManifestProjects } from './utils/get-manifest-projects.mjs';

void (async (): Promise<void> => {
  await generateCodeExamplesManifest({
    codeExamplesPackageName: '@skyux/code-examples',
    outDir: 'dist/libs/components/manifest',
    projects: getManifestProjects(),
  });
})();
