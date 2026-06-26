import { Component, input, model } from '@angular/core';

import { SkyIndicatorDescriptionType } from '../../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../../shared/indicator-icon-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './alert.component.fixture.html',
  standalone: false,
})
export class AlertTestComponent {
  public closeable = input<boolean | undefined>(false);

  public closed = model<boolean | undefined>(false);

  public alertType = input<SkyIndicatorIconType | undefined>('info');

  public descriptionType = input<SkyIndicatorDescriptionType | undefined>(
    undefined,
  );

  public customDescription = input<string | undefined>(undefined);
}
