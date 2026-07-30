import { Provider } from '@angular/core';
import { provideSkyAgGridTesting } from '@skyux/ag-grid/testing';

/**
 * Configures every grid to disable internal timers and animation, which
 * otherwise can cause a `whenStable()` timeout unrelated to the code under
 * test. Add to `TestBed.configureTestingModule`'s `providers`.
 */
export function provideSkyDataGridTesting(): Provider[] {
  return [provideSkyAgGridTesting()];
}
