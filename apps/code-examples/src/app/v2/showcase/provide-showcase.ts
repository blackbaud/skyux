import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  SKY_DOCS_CODE_EXAMPLE_COMPONENTS,
  type SkyDocsShowcaseModuleExportsType,
} from './examples-token';

export function provideSkyDocsShowcaseExamples(
  examples: SkyDocsShowcaseModuleExportsType,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SKY_DOCS_CODE_EXAMPLE_COMPONENTS,
      useValue: examples,
    },
  ]);
}
