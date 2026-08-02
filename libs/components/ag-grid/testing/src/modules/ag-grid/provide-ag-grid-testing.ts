import { Provider } from '@angular/core';
import { SkyAgGridService } from '@skyux/ag-grid';

import { SkyAgGridTestingService } from './ag-grid-testing.service';

/**
 * Configures every grid built through `SkyAgGridService` to disable AG Grid's
 * scroll-visibility recalculation and row/column virtualization. Specs that
 * create and destroy many grids can otherwise see AG Grid's own internal
 * timers and animation frames occasionally leave a `requestAnimationFrame`
 * callback pending indefinitely, which surfaces as a `whenStable()` timeout
 * unrelated to the code under test. Also opts every grid out of AG Grid's
 * Angular test-zone detection (AG Grid's own supported flag) for as long as
 * `SkyAgGridTestingService` is in use, since otherwise AG Grid schedules its
 * internal scroll/viewport work inside the Angular zone under Karma, which
 * can keep the zone from ever reaching stable. The flag is restored to its
 * prior value once the service is destroyed, so specs that don't opt in
 * aren't affected by ones that do (see `SkyAgGridTestingService`). Add to
 * `TestBed.configureTestingModule`'s `providers`, or to a component's own
 * `providers` array.
 */
export function provideSkyAgGridTesting(): Provider[] {
  return [{ provide: SkyAgGridService, useClass: SkyAgGridTestingService }];
}
