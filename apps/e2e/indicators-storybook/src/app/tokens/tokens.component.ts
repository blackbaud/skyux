import { Component } from '@angular/core';
import { SkyToken } from '@skyux/indicators';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  standalone: false,
})
export class TokensComponent {
  public data: SkyToken<{ name: string }>[] = [
    {
      value: {
        name: 'Apple',
      },
    },
    {
      value: {
        name: 'Orange',
      },
    },
    {
      value: {
        name: 'Strawberry',
      },
    },
  ];
}
