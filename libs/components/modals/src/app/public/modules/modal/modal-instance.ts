import {
  EventEmitter
} from '@angular/core';

import {
  SkyModalCloseArgs
} from './modal-close-args';

import {
  SkyModalBeforeCloseHandler
} from './types';

export class SkyModalInstance {
  public componentInstance: any;

  public beforeClose = new EventEmitter<SkyModalBeforeCloseHandler>();
  public closed = new EventEmitter<SkyModalCloseArgs>();
  public helpOpened = new EventEmitter<any>();

  public close(result?: any, reason?: string, ignoreBeforeClose?: boolean) {
    if (reason === undefined) {
      reason = 'close';
    }

    this.closeModal(reason, result, ignoreBeforeClose);
  }

  public cancel(result?: any) {
    this.closeModal('cancel', result);
  }

  public save(result?: any) {
    this.closeModal('save', result);
  }

  public openHelp(helpKey?: string) {
    this.helpOpened.emit(helpKey);
  }

  private closeModal(type: string, result?: any, ignoreBeforeClose = false) {
    const args = new SkyModalCloseArgs();

    args.reason = type;
    args.data = result;

    if (this.beforeClose.observers.length === 0 || ignoreBeforeClose) {
      this.closed.emit(args);
      this.closed.complete();
    } else {
      this.beforeClose.emit(new SkyModalBeforeCloseHandler(() => {
        this.closed.emit(args);
        this.closed.complete();
      }));
    }
  }
}
