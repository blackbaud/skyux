import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyToastInstance } from '@skyux/toast';

@Component({
  selector: 'app-toast-body',
  templateUrl: './toast-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastBodyComponent {
  public message = inject(SkyToastInstance);
}
