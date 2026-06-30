import { Component, input } from '@angular/core';

import { SkyIndicatorDescriptionType } from '../../shared/indicator-description-type';
import { SkyLabelType } from '../label-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label.component.fixture.html',
  standalone: false,
})
export class LabelTestComponent {
  public labelType = input<SkyLabelType | undefined>('info');
  public descriptionType = input<SkyIndicatorDescriptionType | undefined>(
    undefined,
  );
  public customDescription = input<string | undefined>(undefined);
}
