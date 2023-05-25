import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit, OnDestroy {
  public intervalId;

  public windowObs = new Subject<number>();
  public visualObs = new Subject<number>();

  public windowHeight;
  public visualHeight;

  constructor() {
    this.intervalId = setInterval(() => {
      this.windowObs.next(window.innerHeight);
      this.visualObs.next(window.visualViewport.height);
    }, 1000);
  }

  ngOnInit() {
    this.windowObs.subscribe((x) => {
      this.windowHeight = x;
    });
    this.visualObs.subscribe((x) => {
      this.visualHeight = x;
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
