import { InjectionToken } from '@angular/core';

import { Observable, animationFrames } from 'rxjs';

export const ResizeObserverScheduler = new InjectionToken<Observable<unknown>>(
  'ResizeObserverScheduler',
  {
    factory: (): Observable<unknown> => animationFrames(),
  }
);
