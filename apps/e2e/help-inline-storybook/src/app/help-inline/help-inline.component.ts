import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-help-inline',
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss'],
  standalone: false,
})
export class HelpInlineComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
