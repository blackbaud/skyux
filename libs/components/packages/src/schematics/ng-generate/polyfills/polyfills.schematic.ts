import { Rule, chain } from '@angular-devkit/schematics';

import { addPolyfillsConfig } from '../../rules/add-polyfills-config';
import { getRequiredProject } from '../../utility/workspace';

import { Schema } from './schema';

/**
 * Adds '@skyux/packages/polyfills' to a project's configuration.
 */
export default function generatePolyfills(options: Schema): Rule {
  return async (tree) => {
    const { projectName } = await getRequiredProject(tree, options.project);

    return chain([addPolyfillsConfig(projectName, ['build', 'test'])]);
  };
}
