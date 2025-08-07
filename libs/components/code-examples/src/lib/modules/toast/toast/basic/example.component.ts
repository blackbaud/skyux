import { Component, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

/**
 * @title Toast with basic setup
 */
@Component({
  standalone: true,
  selector: 'app-toast-basic-example',
  templateUrl: './example.component.html',
})
export class ToastBasicExampleComponent {
  readonly #toastSvc = inject(SkyToastService);

  public openToast(): void {
    this.#toastSvc.openMessage('This is a sample toast message.', {
      type: SkyToastType.Success,
    });
  }

  public closeAll(): void {
    this.#toastSvc.closeAll();
  }
}
