import { Component, input } from '@angular/core';

@Component({
  templateUrl: './token.component.fixture.html',
  standalone: false,
})
export class SkyTokenTestComponent {
  public ariaLabel = input<string | undefined>(undefined);
  public disabled = input<boolean>(false);
  public dismissible = input<boolean>(false);
  public focusable = input<boolean>(false);
}
