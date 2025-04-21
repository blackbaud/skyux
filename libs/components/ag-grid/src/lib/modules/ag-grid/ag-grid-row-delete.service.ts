import {
  ElementRef,
  InjectionToken,
  Signal,
  WritableSignal,
} from '@angular/core';

import { GridApi } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';

// Use a token because the constructor parameters are not injectable.
export const SKY_AG_GRID_ROW_DELETE_SERVICE =
  new InjectionToken<SkyAgGridRowDeleteService>('SkyAgGridRowDeleteService');

/**
 * Used to provide dependencies to the `SkyAgGridRowDeleteComponent` overlay.
 * @internal
 */
export class SkyAgGridRowDeleteService {
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
