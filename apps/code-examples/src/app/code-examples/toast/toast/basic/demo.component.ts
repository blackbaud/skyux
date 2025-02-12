import { Component, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
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
