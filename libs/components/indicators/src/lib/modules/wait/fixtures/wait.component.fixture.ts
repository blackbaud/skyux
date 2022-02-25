import { Component, ViewChild } from '@angular/core';

import { SkyWaitComponent } from '../wait.component';

import { SkyWaitService } from '../wait.service';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './wait.component.fixture.html',
})
export class SkyWaitTestComponent {
  public ariaLabel: string;

  public isWaiting = false;
  public isFullPage = false;
  public isNonBlocking = false;

  public showAnchor0 = true;
  public showAnchor2 = true;

  public anchor0Visibility = '';
  public anchor0Display = '';

  public anchor2Visibility = '';
  public anchor2Display = '';

  public secondWaitIsWaiting = false;

  @ViewChild(SkyWaitComponent)
  public waitComponent: SkyWaitComponent;

  constructor(private waitService: SkyWaitService) {}

  public endBlockingWait(): void {
    this.waitService.endBlockingPageWait();
  }

  public endNonBlockingWait(): void {
    this.waitService.endNonBlockingPageWait();
  }

  public startBlockingWait(): void {
    this.waitService.beginBlockingPageWait();
  }

  public startNonBlockingWait(): void {
    this.waitService.beginNonBlockingPageWait();
  }
}
