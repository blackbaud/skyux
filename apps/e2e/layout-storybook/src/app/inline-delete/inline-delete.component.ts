import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook/font-loading';

@Component({
  selector: 'app-inline-delete',
  templateUrl: './inline-delete.component.html',
  styleUrls: ['./inline-delete.component.scss'],
  standalone: false,
})
export class InlineDeleteComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
