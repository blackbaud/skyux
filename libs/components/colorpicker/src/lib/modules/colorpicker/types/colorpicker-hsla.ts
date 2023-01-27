/**
 * Colors specified as a combination of hue, saturation, and lightness with an alpha
 * channel to set the opacity.
 */
export interface SkyColorpickerHsla {
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
   * The lightness, which is a percentage value where 0 percent is
   * black and 100 percent is white.
   */
  lightness: number;
  /**
   * The alpha channel to set the opacity.
   */
  alpha: number;
}
