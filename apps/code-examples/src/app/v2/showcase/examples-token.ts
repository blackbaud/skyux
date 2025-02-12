import { InjectionToken, Type } from '@angular/core';

export type SkyShowcaseModuleExportsType = Record<string, Type<unknown>>;

export const SKY_SHOWCASE_EXAMPLES =
  new InjectionToken<SkyShowcaseModuleExportsType>('SKY_SHOWCASE_EXAMPLES');
