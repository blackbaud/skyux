import type { ElementRef, Signal, WritableSignal } from '@angular/core';
import { InjectionToken } from '@angular/core';

import type { GridApi } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';

/**
 * @internal
 */
export const SKY_AG_GRID_ROW_DELETE_CONTEXT =
  new InjectionToken<SkyAgGridRowDeleteContext>('SkyAgGridRowDeleteContext');

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
  ) {
    this.subscription.add(() => {
      this.cancelRowDelete.complete();
      this.confirmRowDelete.complete();
    });
  }
}
