import { Component } from '@angular/core';

import { SkyToastService, SkyToastType } from '@skyux/toast';

@Component({
  selector: 'app-toast-demo',
  templateUrl: './toast-demo.component.html',
})
export class ToastDemoComponent {
  constructor(private toastService: SkyToastService) {}

  public openToast(): void {
    this.toastService.openMessage('This is a sample toast message.', {
      type: SkyToastType.Success,
    });
  }

  public closeAll(): void {
    this.toastService.closeAll();
  }
}
