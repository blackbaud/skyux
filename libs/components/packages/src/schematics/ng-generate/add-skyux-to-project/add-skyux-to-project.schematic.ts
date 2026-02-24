import { Rule, chain } from '@angular-devkit/schematics';
import {
  ProjectDefinition,
  updateWorkspace,
} from '@schematics/angular/utility';

import { Schema } from './schema';

const SUPPORTED_BUILD_BUILDERS = [
  '@angular/build:application',
  '@angular-devkit/build-angular:application',
  '@angular-devkit/build-angular:browser',
  '@blackbaud-internal/skyux-angular-builders:browser',
  '@blackbaud-internal/skyux-build:application',
];

const SUPPORTED_TEST_BUILDERS = [
  '@angular/build:karma',
  '@angular-devkit/build-angular:karma',
  '@blackbaud-internal/skyux-angular-builders:karma',
];

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
    configurePolyfills(project);
    configureStyles(project);
  });
}

function configureAllowedCommonJsDependencies(
  project: ProjectDefinition,
): void {
  const target = project.targets.get('build');

  if (target && SUPPORTED_BUILD_BUILDERS.includes(target.builder)) {
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

function configurePolyfills(project: ProjectDefinition): void {
  const supportedBuilders = SUPPORTED_BUILD_BUILDERS.concat(
    SUPPORTED_TEST_BUILDERS,
  );

  for (const target of ['build', 'test']) {
    const def = project.targets.get(target);

    if (def && supportedBuilders.includes(def.builder)) {
      def.options ??= {};

      const polyfills = normalizePolyfills(def.options['polyfills']);
      const polyfill = '@skyux/packages/polyfills';

      if (!polyfills.includes(polyfill)) {
        def.options['polyfills'] = polyfills.concat(polyfill);
      }
    }
  }
}

function configureStyles(project: ProjectDefinition): void {
  const ourStylesheets = [
    '@skyux/theme/css/sky.css',
    '@skyux/theme/css/themes/modern/styles.css',
  ];

  const supportedBuilders = SUPPORTED_BUILD_BUILDERS.concat(
    SUPPORTED_TEST_BUILDERS,
  );

  for (const target of ['build', 'test']) {
    const def = project.targets.get(target);

    if (def && supportedBuilders.includes(def.builder)) {
      def.options ??= {};
      def.options['styles'] ??= [];

      const stylesheets = def.options['styles'] as string[];

      def.options['styles'] = [...new Set(stylesheets.concat(ourStylesheets))];
    }
  }
}

function normalizePolyfills(polyfills: unknown): string[] {
  if (typeof polyfills === 'string') {
    return [polyfills];
  }

  if (Array.isArray(polyfills)) {
    return polyfills;
  }

  return [];
}
