import { ComponentRef, ElementRef } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { SkyModalAdapterService } from './modal-adapter.service';
import { SkyModalBeforeCloseHandler } from './modal-before-close-handler';
import { SkyModalCloseArgs } from './modal-close-args';

export class SkyModalInstance {
  /**
   * An event that the modal instance emits when it is about to close.
   * It emits a `SkyModalBeforeCloseHandler` object with a `closeModal` method
   * that closes the modal. If a subscription exists for this event,
   * the modal does not close until the subscriber calls the `closeModal` method.
   */
  public get beforeClose(): Observable<SkyModalBeforeCloseHandler> {
    return this.#_beforeClose;
  }

  /**
   * An event that the modal instance emits when it closes.
   * It emits a `SkyModalCloseArgs` object with a `data` property that includes
   * data passed from users on close or save and a `reason` property that indicates
   * whether the modal was saved or closed without saving.
   * The `reason` property accepts any string value.
   * Common examples include `"cancel"`, `"close"`, and `"save"`.
   */
  public get closed(): Observable<SkyModalCloseArgs> {
    return this.#_closed;
  }

  /**
   * An event that the modal instance emits when users click
   * the help inline button.
   * If a `helpKey` parameter was specified, the `helpOpened` event broadcasts the `helpKey`.
   * @deprecated
   */
  public get helpOpened(): Observable<string> {
    return this.#_helpOpened;
  }

  /**
   * A direct reference to the provided component's class.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public componentInstance: any;

  /**
   * Sets the component adapter for the instance. This is used internally for actions such as scrolling the content.
   * @internal
   */
  public set adapter(value: SkyModalAdapterService) {
    this.#adapter = value;
  }

  /**
   * Sets the component ref for the instance. This is used to extract the component instance for the public API and the element ref for internal use.
   * @internal
   */
  public set componentRef(value: ComponentRef<any>) {
    this.componentInstance = value.instance;
    this.#elementRef = value.location;
  }

  #_beforeClose = new Subject<SkyModalBeforeCloseHandler>();

  #_closed = new Subject<SkyModalCloseArgs>();

  /**
   * @deprecated
   */
  #_helpOpened = new Subject<string>();

  #adapter: SkyModalAdapterService | undefined;
  #elementRef: ElementRef | undefined;

  /**
   * Closes the modal instance.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the
   * modal instance. The `SkyModalInstance` provider can be injected into a component's constructor
   * so that this `close` function can be called from a button in the `sky-modal-footer`.
   * @param reason Specifies the reason for the modal closing, with the default reason of `"close"`.
   * @param ignoreBeforeClose Indicates whether to ignore the modal instance's `beforeClose` event.
   */
  public close(
    result?: any,
    reason?: string,
    ignoreBeforeClose?: boolean,
  ): void {
    if (reason === undefined) {
      reason = 'close';
    }

    this.#closeModal(reason, result, ignoreBeforeClose);
  }

  /**
   * Closes the modal instance with `reason="cancel"`.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the modal
   * instance. The `SkyModalInstance` provider can be injected into a component's constructor so
   * that this cancel function can be called from a button in the `sky-modal-footer`.
   */
  public cancel(result?: any): void {
    this.#closeModal('cancel', result);
  }

  /**
   * Closes the modal instance with `reason="save"`.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the modal
   * instance. The `SkyModalInstance` provider can be injected into a component's constructor so
   * that this `save` function can be called from a button in `the sky-modal-footer`.
   */
  public save(result?: any): void {
    this.#closeModal('save', result);
  }

  /**
   * Scrolls the modal content area to the top of its scrollable area.
   */
  public scrollContentToTop(): void {
    if (this.#adapter && this.#elementRef) {
      this.#adapter.scrollContentToTop(this.#elementRef);
    }
  }

  /**
   * Triggers the `helpOpened` event that broadcasts a `helpKey` parameter to open
   * when users click the help inline button.
   * @param helpKey Specifies a string to emit to subscribers of
   * the modal instance's `helpOpened` event. Consumers can inject the `SkyModalInstance` provider
   * into a component's constructor to call the `openHelp` function in the modal template.
   * @deprecated
   */
  public openHelp(helpKey: string): void {
    this.#_helpOpened.next(helpKey);
  }

  #closeModal(type: string, result?: any, ignoreBeforeClose = false): void {
    const args = new SkyModalCloseArgs();

    args.reason = type;
    args.data = result;

    if (this.#_beforeClose.observers.length === 0 || ignoreBeforeClose) {
      this.#notifyClosed(args);
    } else {
      this.#_beforeClose.next(
        new SkyModalBeforeCloseHandler(() => {
          this.#notifyClosed(args);
        }, args),
      );
    }
  }

  #notifyClosed(args: SkyModalCloseArgs): void {
    this.#_closed.next(args);
    this.#_closed.complete();
    this.#_beforeClose.complete();
    this.#_helpOpened.complete();
  }
}
