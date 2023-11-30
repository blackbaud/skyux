import { Component } from '@angular/core';
import { SkyIndicatorDescriptionType } from '@skyux/indicators';
import { SkyLabelType } from '@skyux/indicators';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label-harness-test.component.html',
})
export class LabelHarnessTestComponent {
  public labelType: SkyLabelType = 'info';
  public descriptionType: SkyIndicatorDescriptionType | undefined;
  public customDescription: string | undefined;
}
