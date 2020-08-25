export enum SkyConfirmType {
  /**
   * Allows you to define your own `buttons` using the buttons property to specify an array of `SkyConfirmButtonConfig` objects.
   */
  Custom = 0,
  /**
   * Displays one button with an **OK** label.
   */
  OK = 1,
  /**
   * Displays two buttons with **Yes** and **Cancel** labels.
   */
  YesCancel = 2,
  /**
   * Displays three buttons with **Yes**, **No**, and **Cancel** labels.
   */
  YesNoCancel = 3
}
