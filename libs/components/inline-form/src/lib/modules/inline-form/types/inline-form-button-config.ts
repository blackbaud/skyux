import { SkyInlineFormButtonConfigStyleType } from './inline-form-button-config-style-type';

/**
 * Specifies configuration options for the inline form's buttons when `buttonLayout` is set to `Custom`.
 */
export interface SkyInlineFormButtonConfig {
  /**
   * The `string` value to return when users click a custom button.
   * This correlates to the `reason` in `SkyInlineFormCloseArgs`.
   * The standard values are `cancel`, `delete`, `done`, and `save`, but other custom values are also allowed.
   * @required
   */
  action: string;

  /**
   * The label for the button.
   * @required
   */
  text: string;

  /**
   * Whether to disable the button.
   * @default false
   */
  disabled?: boolean;

  /**
   * The background color and style for the button.
   * The valid options are `default`, `link`, and `primary`.
   * These values set the background color and style from the
   * [secondary, link, and primary button classes](https://developer.blackbaud.com/skyux/components/button) respectively.
   */
  styleType?: SkyInlineFormButtonConfigStyleType;
}
