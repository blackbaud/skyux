import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyToastInstance } from '@skyux/toast';

@Component({
  selector: 'app-toast-custom',
  templateUrl: './toast-custom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastCustomComponent {
  constructor(public message: SkyToastInstance) {}
}
