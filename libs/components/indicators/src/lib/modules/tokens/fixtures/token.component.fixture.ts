import { Component } from '@angular/core';

@Component({
  templateUrl: './token.component.fixture.html',
})
export class SkyTokenTestComponent {
  public ariaLabel: string | undefined;
  public disabled = false;
  public dismissible = false;
  public focusable = false;
}
