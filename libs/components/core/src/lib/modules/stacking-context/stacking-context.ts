import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

export interface SkyStackingContextInterface {
  zIndex: number | Observable<number>;
}

export const SkyStackingContext =
  new InjectionToken<SkyStackingContextInterface>('SkyStackingContext');
