import { Component, Input } from '@angular/core';

@Component({
  templateUrl: './token.component.fixture.html',
})
export class SkyTokenTestComponent {
  @Input()
  public ariaLabel: string | undefined;
}
