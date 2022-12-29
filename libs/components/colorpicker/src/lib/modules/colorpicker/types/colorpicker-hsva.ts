// spell-checker:ignore hsva,colorpicker
/**
 * Specifies colors as a combination of hue, saturation, and value with an alpha
 * channel that specifies the opacity of the color.
 */
export interface SkyColorpickerHsva {
  /**
   * Specifies the hue, which is a degree on the color wheel from 0 to 360.
   * 0 is red, 120 is green, and 240 is blue.
   */
  hue: number;
  /**
   * Specifies the saturation, which is a percentage value where 0 percent is a
   * shade of gray and 100 percent is the full color.
   */
  saturation: number;
  /**
   * Specifies the value, which is a percentage value that describes the brightness
   * or intensity of the color where 0 is completely black and 100 is the brightest
   * and reveals the most color.
   */
  value: number;
  /**
   * Specifies the alpha channel to set the opacity.
   */
  alpha: number;
}
