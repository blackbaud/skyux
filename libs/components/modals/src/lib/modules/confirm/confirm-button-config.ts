export interface SkyConfirmButtonConfig {
  /**
   * The identifier to return when users select the button to close the
   * dialog. This is useful to determine which button users select.
   */
  action: string;
  /**
   * The label for the button.
   */
  text: string;
  /**
   * The style to apply to the button. The valid options are `primary` for
   * the button that triggers the recommended or most-common action, `default` for
   * buttons that trigger less-common actions, `link` for a button that closes
   * the dialog, and `danger` for a primary action that deletes existing data.
   */
  styleType?: 'primary' | 'default' | 'link' | string;
  /**
   * Whether to place focus on this button when the confirm dialog opens. When
   * no button specifies this property, focus is placed on the least destructive
   * button based on its `styleType`, in the order: `link`, `default`, `primary`,
   * `danger`.
   */
  autofocus?: boolean;
}
