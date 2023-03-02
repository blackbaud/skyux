/* istanbul ignore next */
/**
 * @deprecated We recommend using a standard modal with an error component instead.
 */
export class ErrorModalConfig {
  /**
   * The title to display in the modal error message.
   * @required
   */
  public errorTitle: string | undefined;
  /**
   * The description to provide additional details in the modal error message.
   * @required
   */
  public errorDescription: string | undefined;
  /**
   * The label for the action button that closes the modal error message.
   * @required
   */
  public errorCloseText: string | undefined;
}
