import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook/font-loading';

@Component({
  selector: 'app-flyout-standard',
  templateUrl: './flyout-standard.component.html',
  standalone: false,
})
export class FlyoutStandardComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
