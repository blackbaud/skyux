export enum SkyConfirmType {
  /**
   * Allows you to define your own buttons using the `buttons` property of `SkyConfirmConfig`.
   */
  Custom = 0,
  /**
   * Displays one button with an **OK** label and an action of `'ok'`.
   */
  OK = 1,
  /**
   * Displays two buttons with **Yes** and **Cancel** labels.
   * @deprecated Use the `Custom` type to follow the guidance that labels
   * should clearly indicate the actions that occur when users select buttons.
   */
  YesCancel = 2,
  /**
   * Displays three buttons with **Yes**, **No**, and **Cancel** labels.
   * @deprecated Use the `Custom` type to follow the guidance that labels
   * should clearly indicate the actions that occur when users select buttons.
   */
  YesNoCancel = 3,
}
