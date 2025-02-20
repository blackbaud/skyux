import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyIndicatorIconType } from '@skyux/indicators';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: false,
})
export class AlertComponent {
  public readonly variations: SkyIndicatorIconType[] = [
    'info',
    'success',
    'warning',
    'danger',
  ];
  public readonly closeable = [true, false];
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
