// #region imports
import { Component, ViewChild } from '@angular/core';

import { SkyToastComponent } from '../toast.component';
import { SkyToastType } from '../types/toast-type';

// #endregion

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toast.component.fixture.html',
  standalone: false,
})
export class SkyToastTestComponent {
  public autoClose = false;

  @ViewChild(SkyToastComponent, {
    read: SkyToastComponent,
  })
  public toastComponent: SkyToastComponent | undefined;

  public toastType: SkyToastType | undefined;

  public onClosed(): void {
    /* */
  }
}
