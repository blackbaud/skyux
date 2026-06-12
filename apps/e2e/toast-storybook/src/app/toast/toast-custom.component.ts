import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyToastInstance } from '@skyux/toast';

@Component({
  selector: 'app-toast-custom',
  templateUrl: './toast-custom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToastCustomComponent {
  protected readonly message = inject(SkyToastInstance);
}
