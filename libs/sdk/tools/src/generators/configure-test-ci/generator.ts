import { formatFiles } from '@nrwl/devkit';
import { Tree, getProjects, updateProjectConfiguration } from '@nx/devkit';

export async function configureTestCiGenerator(
  tree: Tree,
  options: { skipFormat: boolean }
) {
  const projects = getProjects(tree);
  projects.forEach((project, projectName) => {
    if (
      project.targets?.['test'] &&
      project.targets['test'].executor === '@angular-devkit/build-angular:karma'
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
    }
    updateProjectConfiguration(tree, projectName, project);
  });
  /* istanbul ignore next */
  options.skipFormat || (await formatFiles(tree));
}

export default configureTestCiGenerator;
