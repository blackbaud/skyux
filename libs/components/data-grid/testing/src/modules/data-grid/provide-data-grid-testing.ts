import { Provider } from '@angular/core';
import { provideSkyAgGridTesting } from '@skyux/ag-grid/testing';

/**
 * Configures every data grid in the test to disable AG Grid's row/column
 * virtualization and to opt out of AG Grid's Angular test-zone detection so
 * `SkyDataGridHarness` can reliably wait for the grid to finish rendering.
 * Add to the spec's `TestBed.configureTestingModule` providers.
 * @preview
 */
export function provideSkyDataGridTesting(): Provider[] {
  return [provideSkyAgGridTesting()];
}
