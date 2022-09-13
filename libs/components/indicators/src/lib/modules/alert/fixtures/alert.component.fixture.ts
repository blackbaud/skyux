import { Component } from '@angular/core';

import { SkyIndicatorDescriptionType } from '../../shared/indicator-description-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './alert.component.fixture.html',
})
export class AlertTestComponent {
  public closeable = false;

  public closed = false;

  public alertType: string | undefined = 'info';

  public descriptionType?: SkyIndicatorDescriptionType;

  public customDescription?: string;
}
