import { Component } from '@angular/core';

import { SkyIndicatorDescriptionType } from '../../shared/indicator-description-type';
import { SkyLabelType } from '../label-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label.component.fixture.html',
  standalone: false,
})
export class LabelTestComponent {
  public labelType: SkyLabelType | undefined = 'info';
  public descriptionType: SkyIndicatorDescriptionType | undefined;
  public customDescription: string | undefined;
}
