// #region imports
import { Component, ViewChild } from '@angular/core';

import { SkyToastComponent } from '../toast.component';
import { SkyToasterService } from '../toaster.service';

// #endregion

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toast-with-toaster-service.component.fixture.html',
  providers: [SkyToasterService],
  standalone: false,
})
export class SkyToastWithToasterServiceTestComponent {
  public autoClose = false;

  @ViewChild(SkyToastComponent, {
    read: SkyToastComponent,
    static: true,
  })
  public toastComponent: SkyToastComponent | undefined;

  constructor(public toasterService: SkyToasterService) {}
}
