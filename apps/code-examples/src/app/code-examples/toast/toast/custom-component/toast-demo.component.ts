import { Component } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { ToastContentDemoContext } from './toast-content-demo-context';
import { ToastContentDemoComponent } from './toast-content-demo.component';

@Component({
  selector: 'app-toast-demo',
  templateUrl: './toast-demo.component.html',
})
export class ToastDemoComponent {
  constructor(private toastService: SkyToastService) {}

  public openToast(): void {
    const context = new ToastContentDemoContext(
      'This toast has embedded a custom component for its content.'
    );

    this.toastService.openComponent(
      ToastContentDemoComponent,
      {
        type: SkyToastType.Success,
      },
      [
        {
          provide: ToastContentDemoContext,
          useValue: context,
        },
      ]
    );
  }

  public closeAll(): void {
    this.toastService.closeAll();
  }
}
