/**
 * Specifies the commands to provide the colorpicker.
 */
export enum SkyColorpickerMessageType {
  /**
   * Opens the colorpicker.
   */
  Open = 0,
  /**
   * Resets the selection in the colorpicker.
   */
  Reset = 1,
  /**
   * Toggles whether to display a reset button beside the colorpicker.
   */
  ToggleResetButton = 2,
  /**
   * Closes the colorpicker.
   */
  Close = 3
}
