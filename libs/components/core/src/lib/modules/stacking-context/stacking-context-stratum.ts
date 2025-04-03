import { InjectionToken } from '@angular/core';

import { Stratum } from './stratum-names';

export const SkyStackingContextStratum = new InjectionToken<Stratum>(
  'SkyStackingContextStratum',
  {
    providedIn: 'root',
    factory: (): 'base' => 'base',
  },
);
