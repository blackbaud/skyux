import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyWaitComponent } from './wait.component';

/**
 * @internal
 */
@Component({
  selector: 'sky-wait-page',
  templateUrl: './wait-page.component.html',
  styleUrls: ['./wait-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyWaitComponent],
})
export class SkyWaitPageComponent {
  @Input()
  public hasBlockingWait: boolean | undefined;

  @Input()
  public hasNonBlockingWait: boolean | undefined;
}
