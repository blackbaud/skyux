import {
  Tree,
  formatFiles,
  getProjects,
  updateProjectConfiguration,
} from '@nx/devkit';

export async function configureTestCiGenerator(
  tree: Tree,
  options: { skipFormat: boolean },
): Promise<void> {
  const projects = getProjects(tree);
  projects.forEach((project, projectName) => {
    if (project.targets?.['test']) {
      if (
        project.targets['test'].executor ===
        '@angular-devkit/build-angular:karma'
      ) {
        project.targets['test'].configurations = {
          ...project.targets['test'].configurations,
          ci: {
            browsers: 'ChromeHeadlessNoSandbox',
            codeCoverage: true,
            progress: false,
            sourceMap: true,
            watch: false,
          },
        };
      } else if (project.targets['test'].executor === '@nx/jest:jest') {
        project.targets['test'].configurations = {
          ...project.targets['test'].configurations,
          ci: {
            ci: true,
            codeCoverage: true,
            runInBand: true,
          },
        };
      }
    }
    updateProjectConfiguration(tree, projectName, project);
  });
  /* istanbul ignore next */
  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default configureTestCiGenerator;
