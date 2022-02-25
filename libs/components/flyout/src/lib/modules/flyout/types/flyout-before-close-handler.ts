/**
 * Handler for notifying the flyout when it is appropriate to close the flyout. This will be returned from the flyout instance's `beforeClose` observable.
 */
export class SkyFlyoutBeforeCloseHandler {
  /**
   * Function which should be called to close the flyout. This should be called once any intervening actions have completed.
   */
  public readonly closeFlyout: Function;

  constructor(closeFlyoutFunction: Function) {
    this.closeFlyout = closeFlyoutFunction;
  }
}
