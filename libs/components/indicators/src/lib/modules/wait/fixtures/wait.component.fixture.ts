import { Component, ViewChild, inject, input } from '@angular/core';

import { SkyWaitComponent } from '../wait.component';
import { SkyWaitService } from '../wait.service';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './wait.component.fixture.html',
  standalone: false,
})
export class SkyWaitTestComponent {
  public ariaLabel = input<string | undefined>(undefined);

  public isWaiting = input<boolean>(false);
  public isFullPage = input<boolean>(false);
  public isNonBlocking = input<boolean>(false);

  public screenReaderCompletedText = input<string | undefined>(undefined);

  public showAnchor0 = input<boolean>(true);
  public showAnchor2 = input<boolean>(true);
  public showMenuOverlay = input<boolean>(false);

  public anchor0Visibility = input<string>('');
  public anchor0Display = input<string>('');

  public anchor2Visibility = input<string>('');
  public anchor2Display = input<string>('');

  public secondWaitIsWaiting = input<boolean>(false);

  @ViewChild(SkyWaitComponent)
  public waitComponent: SkyWaitComponent | undefined;

  #waitSvc = inject(SkyWaitService);

  public endBlockingWait(): void {
    this.#waitSvc.endBlockingPageWait();
  }

  public endNonBlockingWait(): void {
    this.#waitSvc.endNonBlockingPageWait();
  }

  public startBlockingWait(): void {
    this.#waitSvc.beginBlockingPageWait();
  }

  public startNonBlockingWait(): void {
    this.#waitSvc.beginNonBlockingPageWait();
  }
}
