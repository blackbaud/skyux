import { Component, OnDestroy } from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';

@Component({
  selector: 'app-wait-demo',
  templateUrl: './wait-demo.component.html',
})
export class WaitDemoComponent implements OnDestroy {
  public isWaiting = false;

  constructor(private waitSvc: SkyWaitService) {}

  public ngOnDestroy(): void {
    this.waitSvc.dispose();
  }

  public togglePageWait(isBlocking: boolean): void {
    if (!this.isWaiting) {
      if (isBlocking) {
        this.waitSvc.beginBlockingPageWait();
      } else {
        this.waitSvc.beginNonBlockingPageWait();
      }
    } else {
      if (isBlocking) {
        this.waitSvc.endBlockingPageWait();
      } else {
        this.waitSvc.endNonBlockingPageWait();
      }
    }
  }
}
