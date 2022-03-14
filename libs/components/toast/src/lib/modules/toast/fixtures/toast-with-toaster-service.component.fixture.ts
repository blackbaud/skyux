// #region imports
import { Component, ViewChild } from '@angular/core';

import { SkyToastComponent } from '../toast.component';
import { SkyToasterService } from '../toaster.service';

// #endregion

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toast.component.fixture.html',
  providers: [SkyToasterService],
})
export class SkyToastWithToasterServiceTestComponent {
  public autoClose: boolean;

  @ViewChild(SkyToastComponent, {
    read: SkyToastComponent,
    static: true,
  })
  public toastComponent: SkyToastComponent;

  constructor(public toasterService: SkyToasterService) {}
}
