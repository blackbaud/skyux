import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyRadioType } from '../types/radio-type';

@Component({
  templateUrl: './radio-single.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkySingleRadioComponent {
  public iconName = 'add';
  public radioType: SkyRadioType | undefined;
}
