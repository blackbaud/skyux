import { Provider } from '@angular/core';
import { provideSkyAgGridTesting } from '@skyux/ag-grid/testing';

/**
 * Delegates to `provideSkyAgGridTesting()` to disable AG Grid's row/column
 * virtualization and keep its scrollbars always visible. Add to
 * `TestBed.configureTestingModule`'s `providers`.
 */
export function provideSkyDataGridTesting(): Provider[] {
  return [provideSkyAgGridTesting()];
}
