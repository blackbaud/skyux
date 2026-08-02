import { DestroyRef, Injectable, inject } from '@angular/core';
import { SkyAgGridService, SkyGetGridOptionsArgs } from '@skyux/ag-grid';

import { GridOptions, ModelUpdatedEvent } from 'ag-grid-community';

import { trackModelUpdate } from './ag-grid-render-tracking';

/**
 * `GridOptions` applied to every grid built through `SkyAgGridService` while
 * `provideSkyAgGridTesting()` is in effect. AG Grid recommends disabling
 * row/column virtualization in tests so the whole grid is DOM-queryable
 * regardless of a consumer's own layout/scroll settings.
 */
const SKY_AG_GRID_TESTING_OPTIONS: Partial<GridOptions> = {
  suppressColumnVirtualisation: true,
  suppressRowVirtualisation: true,
};

/**
 * Records every `modelUpdated` render pass so `SkyAgGridWrapperHarness` can
 * poll for a real, non-zone-dependent readiness signal instead of relying on
 * `whenStable()`, which no longer waits for AG Grid once it runs outside the
 * Angular zone (see `provideSkyAgGridTesting()`).
 */
function withRenderTracking<T>(options: GridOptions<T>): GridOptions<T> {
  const onModelUpdated = options.onModelUpdated;
  return {
    ...options,
    onModelUpdated: (event: ModelUpdatedEvent<T>): void => {
      trackModelUpdate(event.api);
      onModelUpdated?.(event);
    },
  };
}

/**
 * @internal
 * Opts every grid created while this service is active out of AG Grid's
 * Angular test-zone detection (AG Grid's own supported flag), for as long as
 * this service instance is alive. `provideSkyAgGridTesting()` can be added
 * to `TestBed.configureTestingModule()`'s providers *or* to a component's
 * own `providers` array, so this can't rely on an environment-injector-only
 * mechanism (like `ENVIRONMENT_INITIALIZER`) to set/restore the flag - a
 * service constructor works at either injector level, and `DestroyRef` fires
 * correctly for either a TestBed module teardown or a component destroy.
 */
@Injectable()
export class SkyAgGridTestingService extends SkyAgGridService {
  constructor() {
    super();
    const previousValue = (window as any).AG_GRID_UNDER_TEST;
    (window as any).AG_GRID_UNDER_TEST = false;
    inject(DestroyRef).onDestroy(() => {
      (window as any).AG_GRID_UNDER_TEST = previousValue;
    });
  }

  public override getGridOptions<T = any>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> {
    return withRenderTracking({
      ...super.getGridOptions(args),
      ...SKY_AG_GRID_TESTING_OPTIONS,
    });
  }

  public override getEditableGridOptions<T = any>(
    args: SkyGetGridOptionsArgs<T>,
  ): GridOptions<T> {
    return withRenderTracking({
      ...super.getEditableGridOptions(args),
      ...SKY_AG_GRID_TESTING_OPTIONS,
    });
  }
}
