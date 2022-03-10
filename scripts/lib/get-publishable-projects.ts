import fs from 'fs-extra';
import path from 'path';

import { PackageConfigs } from '../shared/package-config';

export async function getPublishableProjects() {
  const angularJson = await fs.readJson(
    path.join(process.cwd(), 'angular.json')
  );

  const distPackages: PackageConfigs = {};

  for (const projectName in angularJson.projects) {
    const projectConfig = angularJson.projects[projectName];
    if (
      projectConfig.projectType === 'library' &&
      projectConfig.architect.build
    ) {
      distPackages[projectName] = {
        distRoot:
          projectConfig.architect.build.options.outputPath ||
          projectConfig.architect.build.outputs[0],
        root: projectConfig.root,
      };

      // Get the name of the NPM package.
      distPackages[projectName].npmName = fs.readJsonSync(
        path.join(process.cwd(), distPackages[projectName].root, 'package.json')
      ).name;
    }
  }

  return distPackages;
}
