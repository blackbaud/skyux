import { Component, model } from '@angular/core';
import { SkyIndicatorDescriptionType, SkyLabelType } from '@skyux/indicators';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label-harness-test.component.html',
  standalone: false,
})
export class LabelHarnessTestComponent {
  public labelType = model<SkyLabelType>('info');
  public descriptionType = model<SkyIndicatorDescriptionType | undefined>(
    undefined,
  );
  public customDescription = model<string | undefined>(undefined);
}
