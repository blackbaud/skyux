import { readJsonSync } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';

import { getPublishableProjects } from './lib/get-publishable-projects';
import { isGitClean } from './utils/git-utils';
import { runCommand } from './utils/spawn';

async function createLibraryResources() {
  console.log('Updating library resources files...');

  try {
    if (!(await isGitClean())) {
      throw new Error(
        'Uncommitted changes detected. Stash or commit the changes and try again.'
      );
    }

    console.log('Preparing i18n schematic...');

    await runCommand('npx', ['nx', 'build', 'i18n']);

    await runCommand('npx', ['nx', 'run', 'i18n:postbuild'], {
      env: { ...process.env, NX_CLOUD_DISTRIBUTED_EXECUTION: 'false' },
    });

    console.log('Done preparing schematic.');

    const projects = await getPublishableProjects();

    for (const projectName in projects) {
      const project = projects[projectName];

      const resourcesFiles = glob.sync(
        `${project.root}/src/assets/locales/resources_*.json`
      );

      if (resourcesFiles.length === 0) {
        console.log(
          ` [!] Resource files not found for project '${projectName}'. Skipping.`
        );
        continue;
      }

      if (
        Object.keys(readJsonSync(join(process.cwd(), resourcesFiles[0])))
          .length > 0
      ) {
        await runCommand('npx', [
          'nx',
          'generate',
          './dist/libs/components/i18n:lib-resources-module',
          `lib/modules/shared/sky-${projectName}`,
          `--project=${projectName}`,
        ]);
      } else {
        console.log(
          ` [?] Empty resources JSON found for project '${projectName}'. ` +
            'Abort generating resources module.'
        );
      }
    }

    console.log('Formatting files (this might take awhile)...');
    await runCommand('npx', [
      'prettier',
      '--loglevel=error',
      '--write',
      'libs/**/*-resources.module.ts',
    ]);
    console.log('Done formatting files.');

    if (!(await isGitClean())) {
      console.warn(
        'Changes found with resources modules. ' +
          'These changes should be committed to the remote repository.'
      );
    } else {
      console.log('Done updating library resources files.');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createLibraryResources();
