import {
  generateCodeExamplesManifest,
  getComponentProjectNames,
} from '../libs/components/manifest-generator/src/index.js';

void (async (): Promise<void> => {
  const projectNames = getComponentProjectNames();
  await generateCodeExamplesManifest({
    codeExamplesPackageName: '@skyux/code-examples',
    outDir: 'dist/libs/components/manifest',
    projectNames,
    projectsRootDirectory: 'libs/components/',
  });
})();
