export interface SkyFlyoutAction {
  /**
   * The button's label.
   */
  label?: string;

  /**
   * A callback function to execute when the button is clicked.
   */
  callback?: () => void;

  /**
   * Whether to close the flyout after the button is clicked.
   */
  closeAfterInvoking?: boolean;
}
