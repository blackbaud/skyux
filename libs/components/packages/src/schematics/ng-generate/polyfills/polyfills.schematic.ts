import { Rule, chain } from '@angular-devkit/schematics';

import { addPolyfillsConfig } from '../../rules/add-polyfills-config';

/**
 * Adds '@skyux/packages/polyfills' to a project's configuration.
 */
export default function generatePolyfills(): Rule {
  return () => {
    return chain([addPolyfillsConfig()]);
  };
}
