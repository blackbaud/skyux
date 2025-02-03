import { Component, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

@Component({
  standalone: true,
  selector: 'app-toast-basic-example',
  templateUrl: './example.component.html',
})
export class ToastBasicExampleComponent {
  readonly #toastSvc = inject(SkyToastService);

  protected openToast(): void {
    this.#toastSvc.openMessage('This is a sample toast message.', {
      type: SkyToastType.Success,
    });
  }

  protected closeAll(): void {
    this.#toastSvc.closeAll();
  }
}
