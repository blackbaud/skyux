import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLabelType } from '@skyux/indicators';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  standalone: false,
})
export class LabelComponent {
  public types: SkyLabelType[] = ['info', 'success', 'warning', 'danger'];

  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
