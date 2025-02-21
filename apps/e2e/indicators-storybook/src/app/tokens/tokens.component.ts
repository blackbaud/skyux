import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyToken } from '@skyux/indicators';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  standalone: false,
})
export class TokensComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));

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
