import { Component, Input } from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'sky-wait-page',
  templateUrl: './wait-page.component.html',
  styleUrls: ['./wait-page.component.scss'],
})
export class SkyWaitPageComponent {
  @Input()
  public hasBlockingWait: boolean | undefined;

  @Input()
  public hasNonBlockingWait: boolean | undefined;
}
