import { Component, OnDestroy, OnInit } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-test-cmp-modal',
  templateUrl: './modal-demo.component.html',
  providers: [SkyModalService],
})
export class ModalDemoComponent implements OnInit, OnDestroy {
  public showHelp = false;
  public title = 'Hello world';

  public intervalId;
  public windowH = new Subject<number>();
  public visualH = new Subject<number>();

  public windowHval;
  public visualHval;

  constructor() {
    this.intervalId = setInterval(() => {
      this.windowH.next(window.innerHeight);
      this.visualH.next(window.visualViewport.height);
    }, 1000);
  }

  ngOnInit() {
    this.windowH.subscribe((x) => {
      this.windowHval = x;
    });
    this.visualH.subscribe((x) => {
      this.visualHval = x;
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
