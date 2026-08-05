import { GridApi } from 'ag-grid-community';

interface RenderState {
  count: number;
  lastRenderedAt: number;
}

const renderStates = new WeakMap<GridApi, RenderState>();

/**
 * @internal
 * Records that AG Grid finished a row-model render pass for the given grid
 * (initial load, sort, filter, or pagination all trigger `modelUpdated`).
 */
export function trackModelUpdate(api: GridApi): void {
  const previous = renderStates.get(api);
  renderStates.set(api, {
    count: (previous?.count ?? 0) + 1,
    lastRenderedAt: Date.now(),
  });
}

/**
 * @internal
 * The number of `modelUpdated` render passes recorded for the given grid.
 */
export function getRenderCount(api: GridApi): number {
  return renderStates.get(api)?.count ?? 0;
}

/**
 * @internal
 * Milliseconds since the last recorded render pass, or `Infinity` if none
 * has been recorded yet. A grid that loads data asynchronously (e.g. an
 * Angular `resource()`) can render an empty pass before its real data
 * arrives, each firing its own `modelUpdated` - this lets callers wait for
 * the render count to stop moving, not just for it to move once.
 */
export function getMsSinceLastRender(api: GridApi): number {
  const state = renderStates.get(api);
  return state ? Date.now() - state.lastRenderedAt : Infinity;
}

/**
 * @internal
 * Whether AG Grid is currently opted out of Angular's test zone (i.e.
 * `provideSkyAgGridTesting()` is active), meaning render counts are actually
 * being recorded and it's safe to wait on them. Consumers of
 * `SkyAgGridWrapperHarness` that don't use `provideSkyAgGridTesting()` get no
 * tracking at all, so waiting on a render count that will never move would
 * just burn the full poll timeout on every read.
 */
export function isRenderTrackingActive(): boolean {
  return (window as any).AG_GRID_UNDER_TEST === false;
}
