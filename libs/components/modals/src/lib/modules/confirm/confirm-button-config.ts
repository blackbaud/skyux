import { SkyConfirmButtonStyleType } from './confirm-button-style-type';

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
  styleType?: SkyConfirmButtonStyleType;
  /**
   * Whether to place focus on this button by default.
   * @deprecated The confirm component automatically focuses the first interactive
   * element of the dialog.
   */
  autofocus?: boolean;
}
