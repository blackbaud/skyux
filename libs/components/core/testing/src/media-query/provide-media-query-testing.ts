/* eslint-disable @nx/enforce-module-boundaries */
import { Provider } from '@angular/core';
import { SkyMediaQueryService } from '@skyux/core';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { SkyMediaQueryTestingService } from './media-query-testing.service';

const MEDIA_QUERY_PROVIDERS: Provider[] = [
  SkyMediaQueryTestingService,
  {
    provide: SkyMediaQueryService,
    useExisting: SkyMediaQueryTestingService,
  },
  {
    provide: SkyMediaQueryTestingController,
    useExisting: SkyMediaQueryTestingService,
  },
];

/**
 * Mocks the media query service for unit tests.
 */
export function provideSkyMediaQueryTesting(): Provider[] {
  // if (options?.overrideComponent) {
  //   TestBed.overrideComponent(options.overrideComponent, {
  //     remove: {
  //       providers: [SkyMediaQueryService],
  //     },
  //     add: {
  //       providers: MEDIA_QUERY_PROVIDERS,
  //     },
  //   });
  // }

  return MEDIA_QUERY_PROVIDERS;
}

// export function forComponent<TComponent>(component: Type<TComponent>) {
//   TestBed.overrideComponent(component, {
//     remove: {
//       providers: [SkyMediaQueryService],
//     },
//     add: {
//       providers: MEDIA_QUERY_PROVIDERS,
//     },
//   });

//   fixture.debugElement
//     .query(By.directive(MediaQueryWrapperTestComponent))
//     .injector.get(SkyMediaQueryTestingController)
// }

// provideSkyMediaQueryTesting(forDirective(MyComponent))
