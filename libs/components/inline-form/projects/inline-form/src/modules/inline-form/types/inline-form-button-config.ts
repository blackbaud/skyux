/**
 * Specifies configuration options for the inline form's buttons.
 */
export interface SkyInlineFormButtonConfig {
  /**
   * Specifies the action that the button performs.
   * The valid options are `cancel`, `delete`, `done`, and `save`.
   * @required
   */
  action: string;

  /**
   * Specifies a label for the button.
   * @required
   */
  text: string;

  /**
   * Indicates whether to disable the button.
   * @default false
   */
  disabled?: boolean;

  /**
   * Specifies a background color and style for the button.
   * The valid options are `default`, `link`, and `primary`.
   * These values set the background color and style from the
   * [secondary, link, and primary button classes](https://developer.blackbaud.com/skyux/components/button) respectively.
   */
  styleType?: string;
}
