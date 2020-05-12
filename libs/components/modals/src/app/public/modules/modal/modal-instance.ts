import {
  Observable,
  Subject
} from 'rxjs';

import {
  SkyModalCloseArgs
} from './modal-close-args';

import {
  SkyModalBeforeCloseHandler
} from './modal-before-close-handler';

export class SkyModalInstance {
  public componentInstance: any;

  public get beforeClose(): Observable<SkyModalBeforeCloseHandler> {
    return this._beforeClose;
  }

  public get closed(): Observable<SkyModalCloseArgs> {
    return this._closed;
  }

  public get helpOpened(): Observable<string> {
    return this._helpOpened;
  }

  private _beforeClose = new Subject<SkyModalBeforeCloseHandler>();

  private _closed = new Subject<SkyModalCloseArgs>();

  private _helpOpened = new Subject<string>();

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
    this._helpOpened.next(helpKey);
  }

  private closeModal(type: string, result?: any, ignoreBeforeClose = false) {
    const args = new SkyModalCloseArgs();

    args.reason = type;
    args.data = result;

    if (this._beforeClose.observers.length === 0 || ignoreBeforeClose) {
      this.notifyClosed(args);
    } else {
      this._beforeClose.next(new SkyModalBeforeCloseHandler(() => {
        this.notifyClosed(args);
      }, args));
    }
  }

  private notifyClosed(args: SkyModalCloseArgs): void {
    this._closed.next(args);
    this._closed.complete();
    this._beforeClose.complete();
    this._helpOpened.complete();
  }
}
