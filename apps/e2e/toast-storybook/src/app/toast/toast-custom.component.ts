import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook';
import { SkyToastInstance } from '@skyux/toast';

@Component({
  selector: 'app-toast-custom',
  templateUrl: './toast-custom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ToastCustomComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));

  constructor(public message: SkyToastInstance) {}
}
