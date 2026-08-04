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
 * Tracks how many live `SkyAgGridTestingService` instances currently want
 * `AG_GRID_UNDER_TEST` forced to `false`, and the value it held before the
 * first of them activated it. `provideSkyAgGridTesting()` can be added to
 * `TestBed.configureTestingModule()`'s providers *and/or* to one or more
 * component `providers` arrays within the same spec, so multiple instances
 * can be alive at once and destroyed in any order - the flag must stay forced
 * while any instance is alive, and the pre-existing value must only be
 * restored once the last one is destroyed.
 */
let activeInstanceCount = 0;
let restoreValue: unknown;

/**
 * @internal
 * Configures every grid with disabled row/column virtualization and opts out
 * of AG Grid's Angular test-zone detection. Specs that create and destroy many
 * grids can otherwise see AG Grid's own internal timers and animation frames
 * occasionally leave a `requestAnimationFrame` callback pending indefinitely,
 * which surfaces as a `whenStable()` timeout unrelated to the code under test.
 * Without zone opt-out, AG Grid schedules its internal scroll/viewport work
 * inside the Angular zone under Karma, which can keep the zone from ever
 * reaching stable. The flag is restored to its prior value once the last live
 * instance is destroyed, so specs that don't opt in aren't affected by ones
 * that do.
 *
 * Note: `provideSkyAgGridTesting()` can be added to `TestBed.configureTestingModule()`'s
 * providers *or* to a component's own `providers` array, so this can't rely on
 * an environment-injector-only mechanism (like `ENVIRONMENT_INITIALIZER`) to
 * set/restore the flag — a service constructor works at either injector level,
 * and `DestroyRef` fires correctly for either a TestBed module teardown or a
 * component destroy.
 */
@Injectable()
export class SkyAgGridTestingService extends SkyAgGridService {
  constructor() {
    super();
    if (activeInstanceCount === 0) {
      restoreValue = (window as any).AG_GRID_UNDER_TEST;
    }
    activeInstanceCount++;
    (window as any).AG_GRID_UNDER_TEST = false;
    inject(DestroyRef).onDestroy(() => {
      activeInstanceCount--;
      if (activeInstanceCount === 0) {
        (window as any).AG_GRID_UNDER_TEST = restoreValue;
      }
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
