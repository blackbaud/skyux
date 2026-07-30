import { Injectable } from '@angular/core';
import { SkyAgGridService, SkyGetGridOptionsArgs } from '@skyux/ag-grid';

import { GridOptions } from 'ag-grid-community';

/**
 * `GridOptions` applied to every grid built through `SkyAgGridService` while
 * `provideSkyAgGridTestingOptions` is in effect. These disable AG Grid's
 * scroll-visibility recalculation and row/column virtualization, both of
 * which schedule their own internal timers and animation frames. Those can
 * occasionally leave a pending `requestAnimationFrame` callback that never
 * fires when many grids are created and destroyed in a single spec file,
 * causing `whenStable()` to hang.
 */
const SKY_AG_GRID_TESTING_OPTIONS: Partial<GridOptions> = {
  alwaysShowHorizontalScroll: true,
  alwaysShowVerticalScroll: true,
  suppressColumnVirtualisation: true,
  suppressRowVirtualisation: true,
};

/**
 * @internal
 */
@Injectable()
export class SkyAgGridTestingService extends SkyAgGridService {
  public override getGridOptions<T = any>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> {
    return { ...super.getGridOptions(args), ...SKY_AG_GRID_TESTING_OPTIONS };
  }

  public override getEditableGridOptions<T = any>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> {
    return {
      ...super.getEditableGridOptions(args),
      ...SKY_AG_GRID_TESTING_OPTIONS,
    };
  }
}
