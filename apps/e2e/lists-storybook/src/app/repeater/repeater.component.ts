import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-repeater',
  templateUrl: './repeater.component.html',
  styleUrls: ['./repeater.component.scss'],
  standalone: false,
})
export class RepeaterComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
