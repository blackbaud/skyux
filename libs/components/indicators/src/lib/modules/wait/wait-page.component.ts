import { Component, Input } from '@angular/core';

import { SkyWaitComponent } from './wait.component';

/**
 * @internal
 */
@Component({
  standalone: true,
  selector: 'sky-wait-page',
  templateUrl: './wait-page.component.html',
  styleUrls: ['./wait-page.component.scss'],
  imports: [SkyWaitComponent],
})
export class SkyWaitPageComponent {
  @Input()
  public hasBlockingWait: boolean | undefined;

  @Input()
  public hasNonBlockingWait: boolean | undefined;
}
