import { Component, OnDestroy, inject } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { ToastCustomComponent } from './toast-custom.component';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: false,
})
export class ToastComponent implements OnDestroy {
  #toastService = inject(SkyToastService);

  public ngOnDestroy(): void {
    this.#toastService.closeAll();
  }

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

  public openComponents(): void {
    this.#toastService.openComponent(ToastCustomComponent, {
      type: SkyToastType.Info,
    });
    this.#toastService.openComponent(ToastCustomComponent, {
      type: SkyToastType.Success,
    });
    this.#toastService.openComponent(ToastCustomComponent, {
      type: SkyToastType.Warning,
    });
    this.#toastService.openComponent(ToastCustomComponent, {
      type: SkyToastType.Danger,
    });
  }

  public closeAll(): void {
    this.#toastService.closeAll();
  }
}
