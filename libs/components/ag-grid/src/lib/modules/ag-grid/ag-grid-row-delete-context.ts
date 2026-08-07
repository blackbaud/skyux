import {
  ElementRef,
  InjectionToken,
  Signal,
  WritableSignal,
} from '@angular/core';

import { GridApi } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';

/**
 * @internal
 */
export const SKY_AG_GRID_ROW_DELETE_CONTEXT =
  new InjectionToken<SkyAgGridRowDeleteContext>('SkyAgGridRowDeleteContext');

/**
 * The region (in viewport coordinates) that is not masked out by the
 * scrollable-host clip-path. Row overlays positioned outside this region
 * are fully hidden by the clip-path and should be removed from the tab order.
 * @internal
 */
export interface SkyAgGridRowDeleteVisibleRegion {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

/**
 * Used to provide dependencies to the `SkyAgGridRowDeleteComponent` overlay.
 * @internal
 */
export class SkyAgGridRowDeleteContext {
  public readonly cancelRowDelete = new Subject<string>();
  public readonly confirmRowDelete = new Subject<string>();
  public readonly subscription = new Subscription();

  constructor(
    public readonly rows: Signal<string[]>,
    public readonly gridElement: Signal<ElementRef<HTMLElement>[] | undefined>,
    public readonly gridApi: WritableSignal<GridApi | undefined>,
    public readonly visibleRegion: Signal<
      SkyAgGridRowDeleteVisibleRegion | undefined
    >,
  ) {
    this.subscription.add(() => {
      this.cancelRowDelete.complete();
      this.confirmRowDelete.complete();
    });
  }
}
