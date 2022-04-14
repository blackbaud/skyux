export interface SkyConfirmButtonConfig {
  /**
   * Specifies an identifier to return when users select the button to close the
   * dialog. This is useful to determine which button users select.
   */
  action: string;
  /**
   * Specifies the label for the button.
   */
  text: string;
  /**
   * Specifies a style to apply to the button. The valid options are `primary` for
   * the button that triggers the recommended or most-common action, `default` for
   * buttons that trigger less-common actions, and `link` for a button that
   * closes the dialog.
   */
  styleType?: 'primary' | 'default' | 'link' | string;
  /**
   * Indicates whether to place focus on this button by default.
   */
  autofocus?: boolean;
}
