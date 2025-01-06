import { Component } from '@angular/core';

import { SkyRadioType } from '../types/radio-type';

@Component({
  templateUrl: './radio-single.component.fixture.html',
  standalone: false,
})
export class SkySingleRadioComponent {
  public icon = 'bold';
  public radioType: SkyRadioType | undefined;
}
