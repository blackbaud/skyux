import { Rule, chain } from '@angular-devkit/schematics';

import { addPolyfillsConfig } from '../../rules/add-polyfills-config';

import { Schema } from './schema';

/**
 * Adds '@skyux/packages/polyfills' to a project's configuration.
 */
export default function generatePolyfills(options: Schema): Rule {
  return async () => {
    if (!options.project) {
      throw new Error('A project name is required.');
    }

    return chain([addPolyfillsConfig(options.project, ['build', 'test'])]);
  };
}
