import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import type { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import type { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'sky-ag-grid-loading',
  imports: [SkyWaitModule],
  templateUrl: './loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyAgGridLoadingComponent implements ILoadingOverlayAngularComp {
  public agInit(_params: ILoadingOverlayParams): void {
    // Do nothing.
  }

  public refresh(_params: ILoadingOverlayParams): void {
    // Do nothing.
  }
}
