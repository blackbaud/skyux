import { Component } from '@angular/core';
import { SkyToken } from '@skyux/indicators';

import { TokensDemoColor } from './tokens-demo-color';

@Component({
  selector: 'app-tokens-demo',
  templateUrl: './tokens-demo.component.html',
})
export class TokensDemoComponent {
  public colors: SkyToken<TokensDemoColor>[] = [
    { value: { name: 'Red' } },
    { value: { name: 'Black' } },
    { value: { name: 'Blue' } },
    { value: { name: 'Brown' } },
    { value: { name: 'Green' } },
    { value: { name: 'Orange' } },
    { value: { name: 'Pink' } },
    { value: { name: 'Purple' } },
    { value: { name: 'Turquoise' } },
    { value: { name: 'White' } },
    { value: { name: 'Yellow' } },
  ];
}
