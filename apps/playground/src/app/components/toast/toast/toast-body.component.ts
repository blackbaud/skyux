import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyToastInstance } from '@skyux/toast';

@Component({
  selector: 'app-toast-body',
  templateUrl: './toast-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastBodyComponent {
  constructor(public message: SkyToastInstance) {}
}
