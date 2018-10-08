import {
  EventEmitter
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import {
  SkyFlyoutMessage,
  SkyFlyoutMessageType
} from './types';

export class SkyFlyoutInstance<T> {
  public closed = new EventEmitter<void>();
  public componentInstance: T;
  public isOpen = true;

  // Used to communicate with the host component.
  public get hostController(): Subject<SkyFlyoutMessage> {
    return this._hostController;
  }

  private _hostController = new Subject<SkyFlyoutMessage>();

  constructor() {
    this.closed.subscribe(() => {
      this.isOpen = false;
    });
  }

  public close() {
    this.hostController.next({
      type: SkyFlyoutMessageType.Close
    });

    this.hostController.complete();
  }
}
