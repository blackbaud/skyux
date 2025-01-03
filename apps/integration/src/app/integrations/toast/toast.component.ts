import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToastComponent {
  #toastService = inject(SkyToastService);

  public openToasts(): void {
    this.#toastService.openMessage('Toast message', {
      type: SkyToastType.Info,
    });
    this.#toastService.openMessage('Toast message', {
      type: SkyToastType.Success,
    });
    this.#toastService.openMessage('Toast message', {
      type: SkyToastType.Warning,
    });
    this.#toastService.openMessage('Toast message', {
      type: SkyToastType.Danger,
    });
  }
}
