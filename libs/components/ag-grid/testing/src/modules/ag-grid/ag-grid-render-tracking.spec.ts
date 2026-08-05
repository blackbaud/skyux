import { GridApi } from 'ag-grid-community';

import {
  getMsSinceLastRender,
  getRenderCount,
  isRenderTrackingActive,
  trackModelUpdate,
} from './ag-grid-render-tracking';

describe('ag-grid-render-tracking', () => {
  it('starts a grid at a render count of 0', () => {
    const api = {} as GridApi;

    expect(getRenderCount(api)).toBe(0);
  });

  it('reports Infinity ms since last render for an untracked grid', () => {
    const api = {} as GridApi;

    expect(getMsSinceLastRender(api)).toBe(Infinity);
  });

  it('reports a finite ms since last render once a model update is tracked', () => {
    const api = {} as GridApi;

    trackModelUpdate(api);

    expect(getMsSinceLastRender(api)).toBeLessThan(Infinity);
  });

  it('increments the render count on each tracked model update', () => {
    const api = {} as GridApi;

    trackModelUpdate(api);
    expect(getRenderCount(api)).toBe(1);

    trackModelUpdate(api);
    expect(getRenderCount(api)).toBe(2);
  });

  it('tracks render counts independently per grid', () => {
    const apiA = {} as GridApi;
    const apiB = {} as GridApi;

    trackModelUpdate(apiA);

    expect(getRenderCount(apiA)).toBe(1);
    expect(getRenderCount(apiB)).toBe(0);
  });

  describe('isRenderTrackingActive', () => {
    const originalValue = (window as any).AG_GRID_UNDER_TEST;

    afterEach(() => {
      (window as any).AG_GRID_UNDER_TEST = originalValue;
    });

    it('is false unless AG_GRID_UNDER_TEST has been explicitly set to false', () => {
      (window as any).AG_GRID_UNDER_TEST = undefined;
      expect(isRenderTrackingActive()).toBeFalse();
    });

    it('is true when AG_GRID_UNDER_TEST is explicitly false', () => {
      (window as any).AG_GRID_UNDER_TEST = false;
      expect(isRenderTrackingActive()).toBeTrue();
    });
  });
});
