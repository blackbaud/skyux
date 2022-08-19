import { Component } from '@angular/core';

import { SkyIndicatorIconType } from '../../shared/indicator-icon-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './alert.component.fixture.html',
})
export class AlertTestComponent {
  public closeable = false;

  public closed = false;

  public alertType: SkyIndicatorIconType | undefined = 'info';
}
