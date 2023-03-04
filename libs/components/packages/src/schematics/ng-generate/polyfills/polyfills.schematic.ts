import { Rule, chain } from '@angular-devkit/schematics';

import { addPolyfillsConfig } from '../../rules/add-polyfills-config';
import validateProject from '../../utility/validate-project';

import { Schema } from './schema';

/**
 * Adds '@skyux/packages/polyfills' to a project's configuration.
 */
export default function generatePolyfills(options: Schema): Rule {
  return async (tree) => {
    const { projectName } = await validateProject(tree, options.project);

    return chain([addPolyfillsConfig(projectName, ['build', 'test'])]);
  };
}
