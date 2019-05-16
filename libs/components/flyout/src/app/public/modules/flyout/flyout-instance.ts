import {
  EventEmitter,
  OnDestroy
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyFlyoutMessage,
  SkyFlyoutMessageType
} from './types';

export class SkyFlyoutInstance<T> implements OnDestroy {
  public closed = new EventEmitter<void>();
  public componentInstance: T;
  public isOpen = true;

  public get iteratorNextButtonClick(): EventEmitter<void> {
    return this._iteratorNextButtonClick;
  }

  public get iteratorPreviousButtonClick(): EventEmitter<void> {
    return this._iteratorPreviousButtonClick;
  }

  public set iteratorNextButtonDisabled(newValue: boolean) {
    this._iteratorNextButtonDisabled = newValue;
    if (newValue) {
      this.hostController.next({
        type: SkyFlyoutMessageType.DisableIteratorNextButton
      });
    } else {
      this.hostController.next({
        type: SkyFlyoutMessageType.EnableIteratorNextButton
      });
    }
  }

  public get iteratorNextButtonDisabled(): boolean {
    return this._iteratorNextButtonDisabled;
  }

  public set iteratorPreviousButtonDisabled(newValue: boolean) {
    this._iteratorPreviousButtonDisabled = newValue;
    if (newValue) {
      this.hostController.next({
        type: SkyFlyoutMessageType.DisableIteratorPreviousButton
      });
    } else {
      this.hostController.next({
        type: SkyFlyoutMessageType.EnableIteratorPreviousButton
      });
    }
  }

  public get iteratorPreviousButtonDisabled(): boolean {
    return this._iteratorPreviousButtonDisabled;
  }

  private _iteratorNextButtonClick = new EventEmitter<void>();

  private _iteratorPreviousButtonClick = new EventEmitter<void>();

  private _iteratorNextButtonDisabled = false;

  private _iteratorPreviousButtonDisabled = false;

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

  public ngOnDestroy(): void {
    this._iteratorPreviousButtonClick.complete();
    this._iteratorNextButtonClick.complete();
  }

  public close(): void {
    this.hostController.next({
      type: SkyFlyoutMessageType.Close
    });

    this.hostController.complete();
  }
}
