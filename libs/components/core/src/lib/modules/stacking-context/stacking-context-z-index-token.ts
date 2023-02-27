import { InjectionToken } from '@angular/core';

import { SkyStackingContextConfig } from './stacking-context-config';

export const SKY_STACKING_CONTEXT =
  new InjectionToken<SkyStackingContextConfig>('SkyStackingContextZIndex');
