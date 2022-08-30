import { Component } from '@angular/core';

import { SkyIndicatorDescriptionType } from '../../shared/indicator-description-type';
import { SkyLabelType } from '../label-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label.component.fixture.html',
})
export class LabelTestComponent {
  public labelType: SkyLabelType = 'info';
  public descriptionType: SkyIndicatorDescriptionType | undefined;
  public customDescription: string | undefined;
}
