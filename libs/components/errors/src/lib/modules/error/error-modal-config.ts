/* istanbul ignore next */
/**
 * @deprecated We recommend using a standard modal with an error component instead.
 */
export class ErrorModalConfig {
  /**
   * A title to display in the modal error message.
   * @required
   */
  public errorTitle: string | undefined;
  /**
   * A description to provide additional details in the modal error message.
   * @required
   */
  public errorDescription: string | undefined;
  /**
   * A label for the action button that closes the modal error message.
   * @required
   */
  public errorCloseText: string | undefined;
}
