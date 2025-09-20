import { Component, ViewChild, inject } from '@angular/core';

import { SkyWaitComponent } from '../wait.component';
import { SkyWaitService } from '../wait.service';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './wait.component.fixture.html',
  standalone: false,
})
export class SkyWaitTestComponent {
  public ariaLabel: string | undefined;

  public isWaiting = false;
  public isFullPage = false;
  public isNonBlocking = false;

  public screenReaderCompletedText: string | undefined;

  public showAnchor0 = true;
  public showAnchor2 = true;
  public showMenuOverlay = false;

  public anchor0Visibility = '';
  public anchor0Display = '';

  public anchor2Visibility = '';
  public anchor2Display = '';

  public secondWaitIsWaiting = false;

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
