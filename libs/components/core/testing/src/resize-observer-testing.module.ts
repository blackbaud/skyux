import { APP_INITIALIZER, NgModule } from '@angular/core';

import { mockResizeObserver } from './resize-observer-mock';

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => (): void => mockResizeObserver(),
      multi: true,
    },
  ],
})
export class SkyResizeObserverTestingModule {}
