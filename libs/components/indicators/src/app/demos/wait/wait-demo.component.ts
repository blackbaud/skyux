import { Component } from '@angular/core';

import {
  SkyWaitService
} from '../../public';

@Component({
  selector: 'sky-wait-demo',
  templateUrl: './wait-demo.component.html'
})
export class SkyWaitDemoComponent {
  public isWaiting = false;

  constructor(private waitSvc: SkyWaitService) { }

  public showPageWait(isBlocking: boolean) {
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
