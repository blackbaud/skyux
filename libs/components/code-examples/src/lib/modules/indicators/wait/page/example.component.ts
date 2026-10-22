import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';

/**
 * @title Wait applied to a page
 */
@Component({
  selector: 'app-indicators-wait-page-example',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './example.component.html',
  imports: [SkyButton],
})
export class IndicatorsWaitPageExampleComponent implements OnDestroy {
  protected isWaiting = false;

  readonly #waitSvc = inject(SkyWaitService);

  public ngOnDestroy(): void {
    this.#waitSvc.dispose();
  }

  protected togglePageWait(isBlocking: boolean): void {
    if (!this.isWaiting) {
      if (isBlocking) {
        this.#waitSvc.beginBlockingPageWait();
      } else {
        this.#waitSvc.beginNonBlockingPageWait();
      }
    } else if (isBlocking) {
      this.#waitSvc.endBlockingPageWait();
    } else {
      this.#waitSvc.endNonBlockingPageWait();
    }

    this.isWaiting = !this.isWaiting;
  }
}
