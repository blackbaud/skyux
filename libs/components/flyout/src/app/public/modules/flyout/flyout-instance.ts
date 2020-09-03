import {
  EventEmitter,
  OnDestroy
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyFlyoutMessage
} from './types/flyout-message';

import {
  SkyFlyoutMessageType
} from './types/flyout-message-type';

/**
 * Represents a single displayed flyout.
 */
export class SkyFlyoutInstance<T> implements OnDestroy {

  /**
   * An event that the flyout instance emits when it closes.
   */
  public closed = new EventEmitter<void>();

  /**
   * Specifies the instance of the component to display in the flyout.
   */
  public componentInstance: T;

  /**
   * Used to communicate with the host component.
   * @internal
   */
  public get hostController(): Subject<SkyFlyoutMessage> {
    return this._hostController;
  }

  /**
   * A `boolean` value that returns `true` if the flyout is open.
   * @default true
   */
  public isOpen = true;

  /**
   * An event that the flyout instance emits when users click the next iterator button.
   */
  public get iteratorNextButtonClick(): EventEmitter<void> {
    return this._iteratorNextButtonClick;
  }

  /**
   * An event that the flyout instance emits when users click the previous iterator button.
   */
  public get iteratorPreviousButtonClick(): EventEmitter<void> {
    return this._iteratorPreviousButtonClick;
  }

  /**
   * Disables the next iterator button.
   * @default false
   */
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

  /**
   * Disables the previous iterator button.
   * @default false
   */
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

  /**
   * Closes the flyout instance and emits its `closed` event.
   */
  public close(): void {
    this.hostController.next({
      type: SkyFlyoutMessageType.Close
    });

    this.hostController.complete();
  }
}
