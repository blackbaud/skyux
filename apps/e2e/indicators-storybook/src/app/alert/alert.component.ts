import { Component } from '@angular/core';
import { SkyIndicatorIconType } from '@skyux/indicators';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  public readonly variations: SkyIndicatorIconType[] = [
    'info',
    'success',
    'warning',
    'danger',
  ];
  public readonly closeable = [true, false];
}
