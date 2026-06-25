import { Component } from '@angular/core';

import { SkyIndicatorDescriptionType } from '../../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../../shared/indicator-icon-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './alert.component.fixture.html',
  standalone: false,
})
export class AlertTestComponent {
  public closeable: boolean | undefined = false;

  public closed: boolean | undefined = false;

  public alertType: SkyIndicatorIconType | undefined = 'info';

  public descriptionType?: SkyIndicatorDescriptionType;

  public customDescription?: string;
}
