// #region imports
import { Component, ViewChild } from '@angular/core';

import { SkyToastComponent } from '../toast.component';
import { SkyToastType } from '../types/toast-type';

// #endregion

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toast.component.fixture.html',
})
export class SkyToastTestComponent {
  public autoClose: boolean;

  @ViewChild(SkyToastComponent, {
    read: SkyToastComponent,
    static: true,
  })
  public toastComponent: SkyToastComponent;

  public toastType: SkyToastType;

  public onClosed(): void {}
}
