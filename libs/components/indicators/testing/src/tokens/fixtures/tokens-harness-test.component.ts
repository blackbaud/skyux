import { Component } from '@angular/core';
import { SkyToken } from '@skyux/indicators';

@Component({
  selector: 'test-tokens-harness',
  templateUrl: './tokens-harness-test.component.html',
})
export class TokensHarnessTestComponent {
  public colors: SkyToken[] = [
    { value: { name: 'Red' } },
    { value: { name: 'Green' } },
    { value: { name: 'Blue' } },
  ];

  public dismissible = true;
}
