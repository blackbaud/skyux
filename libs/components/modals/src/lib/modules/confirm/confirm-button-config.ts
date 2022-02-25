export interface SkyConfirmButtonConfig {
  /**
   * Specifies an identifier to return when users select the button to close the
   * confirmation dialog. This is useful to determine which button users select.
   */
  action: string;
  /**
   * Specifies the label for the button.
   */
  text: string;
  /**
   * Specifies a
   * [SKY UX button class](https://developer.blackbaud.com/skyux-theme/docs/button;docs-active-tab=design)
   * to apply to the button. The valid options are
   * `primary` to format the primary action on the dialog, `default` to format a secondary
   * action, and `link` to format an action that takes users to another page.
   */
  styleType?: string;
  /**
   * Indicates whether to place focus on this button by default.
   */
  autofocus?: boolean;
}
