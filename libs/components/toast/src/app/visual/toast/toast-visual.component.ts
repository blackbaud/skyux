import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import {
  SkyToastService,
  SkyToastType
} from '../../public/public_api';

import {
  ToastDemoComponent
} from './toast-demo.component';

@Component({
  selector: 'toast-visual',
  templateUrl: './toast-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastVisualComponent implements OnDestroy {
  constructor(
    private toastService: SkyToastService
  ) { }

  public ngOnDestroy(): void {
    this.toastService.closeAll();
  }

  public openToasts(): void {
    this.toastService.openMessage('Toast message', { type: SkyToastType.Info });
    this.toastService.openMessage('Toast message', { type: SkyToastType.Success });
    this.toastService.openMessage('Toast message', { type: SkyToastType.Warning });
    this.toastService.openMessage('Toast message', { type: SkyToastType.Danger });
  }

  public openComponents(): void {
    this.toastService.openComponent(ToastDemoComponent, { type: SkyToastType.Info });
    this.toastService.openComponent(ToastDemoComponent, { type: SkyToastType.Success });
    this.toastService.openComponent(ToastDemoComponent, { type: SkyToastType.Warning });
    this.toastService.openComponent(ToastDemoComponent, { type: SkyToastType.Danger });
  }

  public closeAll(): void {
    this.toastService.closeAll();
  }
}
