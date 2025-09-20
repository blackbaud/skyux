import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { ToastBodyComponent } from './toast-body.component';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToastComponent implements OnDestroy {
  constructor(private toastService: SkyToastService) {}

  public ngOnDestroy(): void {
    this.toastService.closeAll();
  }

  public openToasts(): void {
    this.toastService.openMessage('Toast message');
    this.toastService.openMessage('Toast message', { type: SkyToastType.Info });
    this.toastService.openMessage('Toast message', {
      type: SkyToastType.Success,
    });
    this.toastService.openMessage('Toast message', {
      type: SkyToastType.Warning,
    });
    this.toastService.openMessage('Toast message', {
      type: SkyToastType.Danger,
    });
  }

  public openComponents(): void {
    this.toastService.openComponent(ToastBodyComponent, {
      type: SkyToastType.Info,
    });
    this.toastService.openComponent(ToastBodyComponent, {
      type: SkyToastType.Success,
    });
    this.toastService.openComponent(ToastBodyComponent, {
      type: SkyToastType.Warning,
    });
    this.toastService.openComponent(ToastBodyComponent, {
      type: SkyToastType.Danger,
    });
  }

  public closeAll(): void {
    this.toastService.closeAll();
  }
}
