import { Component, model } from '@angular/core';
import { SkyToken, SkyTokenSelectedEventArgs } from '@skyux/indicators';

@Component({
  selector: 'test-tokens-harness',
  templateUrl: './tokens-harness-test.component.html',
  standalone: false,
})
export class TokensHarnessTestComponent {
  public colors = model<SkyToken[]>([
    { value: { name: 'Red' } },
    { value: { name: 'Green' } },
    { value: { name: 'Blue' } },
  ]);

  public disabled = model(false);
  public dismissible = model(true);

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onTokenSelected(_: SkyTokenSelectedEventArgs): void {}
}
