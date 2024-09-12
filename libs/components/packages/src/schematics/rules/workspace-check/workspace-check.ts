import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { getWorkspace } from '../../utility/workspace';

export function workspaceCheck(): Rule {
  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    const { workspace } = await getWorkspace(tree);
    workspace.projects.forEach((project, projectName) => {
      const build = project.targets.get('build');
      if (
        build?.builder === '@angular-devkit/build-angular:application' &&
        (build.options?.['ssr'] ||
          Object.values(build.configurations ?? {}).some(
            (config) => config?.['ssr'],
          ))
      ) {
        context.logger.warn(
          `Project ${projectName} is using server-side rendering (SSR), which is not fully supported by the current version of SKY UX.`,
        );
      }
    });
  };
}
