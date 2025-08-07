import { Component } from '@angular/core';
import { SkyToken, SkyTokensModule } from '@skyux/indicators';

/**
 * @title Tokens with basic setup
 */
@Component({
  selector: 'app-indicators-tokens-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyTokensModule],
})
export class IndicatorsTokensBasicExampleComponent {
  public colors: SkyToken<{
    name: string;
  }>[] = [
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
