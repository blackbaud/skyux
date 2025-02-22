import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  SKY_SHOWCASE_EXAMPLES,
  type SkyShowcaseModuleExportsType,
} from './examples-token';

export function provideSkyShowcaseExamples(
  examples: SkyShowcaseModuleExportsType,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SKY_SHOWCASE_EXAMPLES,
      useValue: examples,
    },
  ]);
}
