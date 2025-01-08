import { Component } from '@angular/core';
import { SkyToken, SkyTokensModule } from '@skyux/indicators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyTokensModule],
})
export class DemoComponent {
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
