import { Provider } from '@angular/core';
import { SkyAgGridService } from '@skyux/ag-grid';

import { SkyAgGridTestingService } from './ag-grid-testing.service';

/**
 * Configures every grid built through `SkyAgGridService` to disable AG Grid's
 * scroll-visibility recalculation and row/column virtualization. Specs that
 * create and destroy many grids can otherwise see AG Grid's own internal
 * timers and animation frames occasionally leave a `requestAnimationFrame`
 * callback pending indefinitely, which surfaces as a `whenStable()` timeout
 * unrelated to the code under test. Add to `TestBed.configureTestingModule`'s
 * `providers`.
 */
export function provideSkyAgGridTesting(): Provider[] {
  return [{ provide: SkyAgGridService, useClass: SkyAgGridTestingService }];
}
