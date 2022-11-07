import { Component } from '@angular/core';

import { SkyToken } from '../types/token';

@Component({
  selector: 'sky-token-a11y-test',
  templateUrl: './token-a11y.component.fixture.html',
})
export class SkyTokenA11yTestComponent {
  public data: SkyToken<{ name: string }>[] = [
    {
      value: { name: 'Apple' },
    },
    {
      value: { name: 'Orange' },
    },
    {
      value: { name: 'Strawberry' },
    },
  ];
}
