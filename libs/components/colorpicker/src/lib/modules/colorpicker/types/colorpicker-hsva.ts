/**
 * Colors specified as a combination of hue, saturation, and value with an alpha
 * channel to set the opacity.
 */
export interface SkyColorpickerHsva {
  /**
   * The hue, which is a degree on the color wheel from 0 to 360.
   * 0 is red, 120 is green, and 240 is blue.
   */
  hue: number;
  /**
   * The saturation, which is a percentage value where 0 percent is a
   * shade of gray and 100 percent is the full color.
   */
  saturation: number;
  /**
   * The brightness or intensity, which is a percentage value of the
   * color where 0 is completely black and 100 is the brightest and
   * reveals the most color.
   */
  value: number;
  /**
   * The alpha channel to set the opacity.
   */
  alpha: number;
}
