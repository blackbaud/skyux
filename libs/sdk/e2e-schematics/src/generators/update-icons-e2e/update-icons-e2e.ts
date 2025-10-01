import { Tree, getProjects } from '@nx/devkit';

import { updateProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

export function updateIconsE2eGenerator(tree: Tree): void {
  const iconsProjects = new Map(
    Array.from(getProjects(tree).entries()).filter(([, project]) =>
      project.tags?.includes('icons-e2e'),
    ),
  );
  iconsProjects.forEach((project, projectName) => {
    if (
      !project.targets?.['e2e'] ||
      project.targets['e2e'].executor !== '@nx/cypress:cypress'
    ) {
      console.warn(
        `Project ${projectName} does not have a Cypress e2e target. Skipping...`,
      );
      return;
    }
    const screenshotsPath = `dist/cypress/apps/e2e/${projectName}/screenshots`;
    const iconInventories = tree
      .children(screenshotsPath)
      .filter(
        (file) => file.startsWith('sky-icon-names-') && file.endsWith('.json'),
      );
    if (iconInventories.length === 0) {
      console.warn(
        `Unable to find icon inventory files in ${screenshotsPath}. Run one of the following commands to generate them:`,
      );
      console.warn(` # npx nx e2e ${projectName} -c ci`);
      console.warn(`   OR`);
      console.warn(` # npx nx run-many -t e2e -c ci --projects=tag:icons-e2e`);
      return;
    }
    const iconsPerSpecFile: Record<string, string[]> = {};
    for (const inventory of iconInventories) {
      const item = JSON.parse(
        tree.read(`${screenshotsPath}/${inventory}`, 'utf-8') as string,
      ) as {
        test: string;
        file: string;
        iconNames: string[];
      };
      if (item.file in iconsPerSpecFile) {
        iconsPerSpecFile[item.file].push(...item.iconNames);
        iconsPerSpecFile[item.file] = Array.from(
          new Set(iconsPerSpecFile[item.file]),
        ).sort();
      } else {
        iconsPerSpecFile[item.file] = Array.from(
          new Set(item.iconNames),
        ).sort();
      }
    }
    const mostInterestingSpecFiles = Object.fromEntries(
      Object.entries(iconsPerSpecFile)
        .filter(([, icons]) => icons.length > 3)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 5),
    );
    const iconsIncluded = Array.from(
      new Set(Object.values(mostInterestingSpecFiles).flat()),
    ).sort();
    const specFiles = Object.keys(mostInterestingSpecFiles).sort();
    project.metadata ??= {};
    project.metadata['icons-e2e'] = {
      icons: iconsIncluded,
    };
    project.tags = (project.tags as string[])
      .filter((tag) => !tag.startsWith('icon:'))
      .concat(
        projectName.startsWith('icon-')
          ? []
          : iconsIncluded.map((tag) => `icon:${tag}`),
      );
    project.targets['e2e'].configurations ??= {};
    project.targets['e2e'].configurations['icons-e2e'] = {
      spec: specFiles.map((file) => `**/${file}`).join(','),
    };
    project.targets['e2e'].configurations['icons-e2e-ci'] = {
      ...project.targets['e2e'].configurations['ci'],
      ...project.targets['e2e'].configurations['icons-e2e'],
    };
    updateProjectConfiguration(tree, projectName, project);
  });
}

export default updateIconsE2eGenerator;
