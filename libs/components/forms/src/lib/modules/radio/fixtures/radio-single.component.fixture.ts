import { Component, input } from '@angular/core';

import { SkyRadioType } from '../types/radio-type';

@Component({
  templateUrl: './radio-single.component.fixture.html',
  standalone: false,
})
export class SkySingleRadioComponent {
  public iconName = input<string>('add');
  public radioType = input<SkyRadioType | undefined>(undefined);
}
