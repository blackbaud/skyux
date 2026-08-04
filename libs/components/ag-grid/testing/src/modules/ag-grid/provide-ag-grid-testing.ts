import { Provider } from '@angular/core';
import { SkyAgGridService } from '@skyux/ag-grid';

import { SkyAgGridTestingService } from './ag-grid-testing.service';

/**
 * Configures every grid built through `SkyAgGridService` to disable AG Grid's
 * row/column virtualization and to opt out of AG Grid's Angular test-zone
 * detection while the test is running, so grid work completes without hanging
 * `whenStable()`. The previous test-zone setting is restored when the test's
 * injector is destroyed, so specs that don't opt in aren't affected by ones
 * that do. Add to the spec's `TestBed.configureTestingModule` providers.
 *
 * @example
 * ```typescript
 * TestBed.configureTestingModule({
 *   providers: [provideSkyAgGridTesting()],
 * });
 * ```
 * @preview
 */
export function provideSkyAgGridTesting(): Provider[] {
  return [{ provide: SkyAgGridService, useClass: SkyAgGridTestingService }];
}
