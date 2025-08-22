import { Component, Input } from '@angular/core';

import { SkyWaitComponent } from './wait.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-wait-page',
  templateUrl: './wait-page.component.html',
  imports: [SkyWaitComponent],
})
export class SkyWaitPageComponent {
  @Input()
  public hasBlockingWait: boolean | undefined;

  @Input()
  public hasNonBlockingWait: boolean | undefined;
}
