/* istanbul ignore next */
export class ErrorModalConfig {
  /**
   * Specifies a title to display in the modal error message.
   * @required
   */
  public errorTitle: string;
  /**
   * Specifies a description to provide additional details in the modal error message.
   * @required
   */
  public errorDescription: string;
  /**
   * Specifies a label for the action button that closes the modal error message.
   * @required
   */
  public errorCloseText: string;
}
