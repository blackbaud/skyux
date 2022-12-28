// spell-checker:ignore colorpicker
/**
 * Colors as a combination of red, green, and blue with an alpha
 * channel that specifies the opacity of the color.
 */
export interface SkyColorpickerRgba {
  /**
   * The percentage of red to use.
   */
  red: number;
  /**
   * The percentage of green to use.
   */
  green: number;
  /**
   * The percentage of blue to use.
   */
  blue: number;
  /**
   * The alpha channel to set the opacity.
   */
  alpha: number;
}
