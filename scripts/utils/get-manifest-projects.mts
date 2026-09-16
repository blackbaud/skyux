import {
  type ProjectDefinition,
  getComponentProjectNames,
  getProjectDefinitions,
} from '../../libs/components/manifest-generator/src/index.js';

/**
 * The projects whose public API is included in the manifest.
 */
export function getManifestProjects(): ProjectDefinition[] {
  return [
    ...getProjectDefinitions({
      packageScope: '@skyux',
      projectNames: getComponentProjectNames(),
      projectsRootDirectory: 'libs/components/',
    }),
    ...getProjectDefinitions({
      packageScope: '@skyux-sdk',
      projectNames: ['testing', 'vitest'],
      projectsRootDirectory: 'libs/sdk/',
    }),
  ];
}
