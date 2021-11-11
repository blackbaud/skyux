import { Component } from '@angular/core';

import { SkyWaitService } from '@skyux/indicators';

@Component({
  selector: 'app-wait-demo',
  templateUrl: './wait-demo.component.html',
})
export class WaitDemoComponent {
  public isWaiting = false;

  constructor(private waitSvc: SkyWaitService) {}

  public showPageWait(isBlocking: boolean): void {
    if (isBlocking) {
      this.waitSvc.beginBlockingPageWait();
      setTimeout(() => {
        this.waitSvc.endBlockingPageWait();
      }, 2000);
    } else {
      this.waitSvc.beginNonBlockingPageWait();
      setTimeout(() => {
        this.waitSvc.endNonBlockingPageWait();
      }, 2000);
    }
  }
}
