import { EventEmitter } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { SkyFlyoutBeforeCloseHandler } from './types/flyout-before-close-handler';
import { SkyFlyoutCloseArgs } from './types/flyout-close-args';
import { SkyFlyoutMessage } from './types/flyout-message';
import { SkyFlyoutMessageType } from './types/flyout-message-type';

/**
 * Represents a single displayed flyout.
 */
export class SkyFlyoutInstance<T> {
  /**
   * An event that the flyout instance emits when it is about to close.
   * If a subscription exists for this event,
   * the flyout does not close until the subscriber calls the handler's `closeModal` method.
   */
  public get beforeClose(): Observable<SkyFlyoutBeforeCloseHandler> {
    return this.#_beforeClose;
  }

  /**
   * An event that the flyout instance emits when it closes.
   */
  public closed = new EventEmitter<void>();

  /**
   * The instance of the component to display in the flyout.
   */
  public componentInstance!: T;

  /**
   * Used to communicate with the host component.
   * @internal
   */
  public get hostController(): Subject<SkyFlyoutMessage> {
    return this.#_hostController;
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
    return this.#_iteratorNextButtonClick;
  }

  /**
   * An event that the flyout instance emits when users click the previous iterator button.
   */
  public get iteratorPreviousButtonClick(): EventEmitter<void> {
    return this.#_iteratorPreviousButtonClick;
  }

  /**
   * Disables the next iterator button.
   * @default false
   */
  public set iteratorNextButtonDisabled(newValue: boolean) {
    this.#_iteratorNextButtonDisabled = newValue;
    if (newValue) {
      this.hostController.next({
        type: SkyFlyoutMessageType.DisableIteratorNextButton,
      });
    } else {
      this.hostController.next({
        type: SkyFlyoutMessageType.EnableIteratorNextButton,
      });
    }
  }

  public get iteratorNextButtonDisabled(): boolean {
    return this.#_iteratorNextButtonDisabled;
  }

  /**
   * Disables the previous iterator button.
   * @default false
   */
  public set iteratorPreviousButtonDisabled(newValue: boolean) {
    this.#_iteratorPreviousButtonDisabled = newValue;
    if (newValue) {
      this.hostController.next({
        type: SkyFlyoutMessageType.DisableIteratorPreviousButton,
      });
    } else {
      this.hostController.next({
        type: SkyFlyoutMessageType.EnableIteratorPreviousButton,
      });
    }
  }

  public get iteratorPreviousButtonDisabled(): boolean {
    return this.#_iteratorPreviousButtonDisabled;
  }

  #_beforeClose = new Subject<SkyFlyoutBeforeCloseHandler>();

  #_iteratorNextButtonClick = new EventEmitter<void>();

  #_iteratorPreviousButtonClick = new EventEmitter<void>();

  #_iteratorNextButtonDisabled = false;

  #_iteratorPreviousButtonDisabled = false;

  #_hostController = new Subject<SkyFlyoutMessage>();

  // TODO: Remove this being optional in a future breaking change.
  constructor(componentInstance?: T) {
    if (!componentInstance) {
      console.warn(
        `The SkyFlyoutInstance was created without a reference to the flyout's child component instance.
        The instance will not have a reference to this child component.
        Support for creating an instance without this reference will be removed in a future breaking change.`,
      );
    }

    this.componentInstance = componentInstance!;
    this.closed.subscribe(() => {
      this.isOpen = false;
    });
  }

  /**
   * Closes the flyout instance and emits its `closed` event.
   * @param args Arguments used when closing the flyout.
   */
  public close(args?: SkyFlyoutCloseArgs): void {
    this.hostController.next({
      type: SkyFlyoutMessageType.Close,
      data: { ignoreBeforeClose: args ? args.ignoreBeforeClose : false },
    });

    this.#_iteratorPreviousButtonClick.complete();
    this.#_iteratorNextButtonClick.complete();

    this.hostController.complete();
  }
}
