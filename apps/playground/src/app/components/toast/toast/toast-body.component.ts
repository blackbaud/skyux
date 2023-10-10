import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyToastInstance } from '@skyux/toast';

@Component({
  standalone: true,
  selector: 'app-toast-body',
  templateUrl: './toast-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastBodyComponent {
  constructor(public message: SkyToastInstance) {}
}
