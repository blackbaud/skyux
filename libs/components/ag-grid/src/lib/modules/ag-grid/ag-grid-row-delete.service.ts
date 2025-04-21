import { ElementRef, Injectable, Signal, WritableSignal } from '@angular/core';

import { GridApi } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';

/**
 * Used to provide dependencies to the `SkyAgGridRowDeleteComponent` overlay.
 * @internal
 */
@Injectable()
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
