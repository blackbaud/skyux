// spell-checker:ignore colorpicker
/**
 * Specifies colors as a combination of red, green, and blue with an alpha
 * channel that specifies the opacity of the color.
 */
export interface SkyColorpickerRgba {
  /**
   * Specifies the percentage of red to use.
   */
  red: number;
  /**
   * Specifies the percentage of green to use.
   */
  green: number;
  /**
   * Specifies the percentage of blue to use.
   */
  blue: number;
  /**
   * Specifies the alpha channel to set the opacity.
   */
  alpha: number;
}
