import { Observable, Subject } from 'rxjs';

import { SkyModalCloseArgs } from './modal-close-args';

import { SkyModalBeforeCloseHandler } from './modal-before-close-handler';

// TODO: this class won't show in the generated docs until this work is done:
// https://github.com/blackbaud/skyux-docs-tools/issues/30

/**
 * Allows you to close the modal and return data from the launched modal.
 */
export class SkyModalInstance {
  /**
   * An event that the modal instance emits when it is about to close.
   * It emits a `SkyModalBeforeCloseHandler` object with a `closeModal` method
   * that closes the modal. If a subscription exists for this event,
   * the modal does not close until the subscriber calls the `closeModal` method.
   */
  public get beforeClose(): Observable<SkyModalBeforeCloseHandler> {
    return this._beforeClose;
  }

  /**
   * An event that the modal instance emits when it closes.
   * It emits a `SkyCloseModalArgs` object with a `data` property that includes
   * data passed from users on close or save and a `reason` property that indicates
   * whether the modal was saved or closed without saving.
   * The `reason` property accepts any string value.
   * Common examples include `cancel`, `close`, and `save`.
   */
  public get closed(): Observable<SkyModalCloseArgs> {
    return this._closed;
  }

  /**
   * An event that the modal instance emits when users click
   * the <i class="fa fa-question-circle" aria-hidden="true"></i> button.
   * If a `helpKey` parameter was specified, the `helpOpened` event broadcasts the `helpKey`.
   */
  public get helpOpened(): Observable<string> {
    return this._helpOpened;
  }

  /**
   * A direct reference to the provided component's class.
   */
  public componentInstance: any;

  private _beforeClose = new Subject<SkyModalBeforeCloseHandler>();

  private _closed = new Subject<SkyModalCloseArgs>();

  private _helpOpened = new Subject<string>();

  /**
   * Closes the modal instance.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the
   * modal instance. The `SkyModalInstance` provider can be injected into a component's constructor
   * so that this `close` function can be called from a button in the `sky-modal-footer`.
   * @param reason Specifies the reason for the modal closing, with the default reason of `close`.
   * @param ignoreBeforeClose Indicates whether to ignore the modal instance's `beforeClose` event.
   */
  public close(
    result?: any,
    reason?: string,
    ignoreBeforeClose?: boolean
  ): void {
    if (reason === undefined) {
      reason = 'close';
    }

    this.closeModal(reason, result, ignoreBeforeClose);
  }

  /**
   * Closes the modal instance with `reason=cancel`.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the modal
   * instance. The `SkyModalInstance` provider can be injected into a component's constructor so
   * that this cancel function can be called from a button in the `sky-modal-footer`.
   */
  public cancel(result?: any): void {
    this.closeModal('cancel', result);
  }

  /**
   * Closes the modal instance with `reason=save`.
   * @param result Specifies an object to emit to subscribers of the `closed` event of the modal
   * instance. The `SkyModalInstance` provider can be injected into a component's constructor so
   * that this `save` function can be called from a button in `the sky-modal-footer`.
   */
  public save(result?: any): void {
    this.closeModal('save', result);
  }

  /**
   * Triggers the `helpOpened` event that broadcasts a `helpKey` parameter to open
   * when users click the <i class="fa fa-question-circle" aria-hidden="true"></i> button.
   * @param helpKey Specifies a string to emit to subscribers of
   * the modal instance's `helpOpened` event. Consumers can inject the `SkyModalInstance` provider
   * into a component's constructor to call the `openHelp` function in the modal template.
   */
  public openHelp(helpKey?: string): void {
    this._helpOpened.next(helpKey);
  }

  private closeModal(
    type: string,
    result?: any,
    ignoreBeforeClose = false
  ): void {
    const args = new SkyModalCloseArgs();

    args.reason = type;
    args.data = result;

    if (this._beforeClose.observers.length === 0 || ignoreBeforeClose) {
      this.notifyClosed(args);
    } else {
      this._beforeClose.next(
        new SkyModalBeforeCloseHandler(() => {
          this.notifyClosed(args);
        }, args)
      );
    }
  }

  private notifyClosed(args: SkyModalCloseArgs): void {
    this._closed.next(args);
    this._closed.complete();
    this._beforeClose.complete();
    this._helpOpened.complete();
  }
}
