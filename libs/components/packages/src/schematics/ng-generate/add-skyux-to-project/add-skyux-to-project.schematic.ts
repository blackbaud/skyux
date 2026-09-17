import { chain, Rule } from '@angular-devkit/schematics';
import {
  ProjectDefinition,
  updateWorkspace,
} from '@schematics/angular/utility';

import {
  builderHasStylesOption,
  ESBUILD_BUILDERS,
  WEBPACK_BUILDERS,
} from '../../utility/builders';
import { Schema } from './schema';

export default function addSkyuxToProject(options: Schema): Rule {
  const { project: projectName } = options;

  return () => {
    return chain([modifyWorkspaceConfig(projectName)]);
  };
}

function modifyWorkspaceConfig(projectName: string): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName) as ProjectDefinition;

    configureAllowedCommonJsDependencies(project);
    configureStyles(project);
  });
}

function configureAllowedCommonJsDependencies(
  project: ProjectDefinition,
): void {
  const target = project.targets.get('build');

  if (
    target &&
    WEBPACK_BUILDERS.concat(ESBUILD_BUILDERS).includes(target.builder)
  ) {
    target.options ??= {};
    target.options['allowedCommonJsDependencies'] ??= [];

    const allowedCommonJsDependencies = target.options[
      'allowedCommonJsDependencies'
    ] as string[];

    allowedCommonJsDependencies.push(
      '@skyux/icons',
      'autonumeric',
      'fontfaceobserver',
      'intl-tel-input',
      'moment',
    );

    target.options['allowedCommonJsDependencies'] = [
      ...new Set(allowedCommonJsDependencies),
    ].sort((a, b) => a.localeCompare(b));
  }
}

function configureStyles(project: ProjectDefinition): void {
  const ourStylesheets = [
    '@skyux/theme/css/sky.css',
    '@skyux/theme/css/themes/modern/styles.css',
  ];

  for (const target of ['build', 'test']) {
    const def = project.targets.get(target);

    if (def && builderHasStylesOption(def.builder)) {
      def.options ??= {};
      def.options['styles'] ??= [];

      const stylesheets = def.options['styles'] as string[];

      def.options['styles'] = [...new Set(stylesheets.concat(ourStylesheets))];
    }
  }
}
