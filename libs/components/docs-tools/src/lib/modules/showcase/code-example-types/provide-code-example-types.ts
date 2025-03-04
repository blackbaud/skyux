import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES,
  type SkyDocsCodeExampleComponentTypes,
} from './code-example-types-token';

/**
 * Provides code example declarations (e.g., Type<unknown>) to be used by the
 * code example viewer to dynamically create each code example component.
 * @example
 * ```
 * import * as examples from '@skyux/code-examples';
 *
 * provideSkyDocsCodeExampleTypes(examples);
 * ```
 * @internal
 */
export function provideSkyDocsCodeExampleTypes(
  examples: SkyDocsCodeExampleComponentTypes,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES,
      useValue: examples,
    },
  ]);
}
