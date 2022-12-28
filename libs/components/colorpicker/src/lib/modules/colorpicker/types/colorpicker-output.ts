// spell-checker:ignore Colorpicker, denormalize, Hsla, Hsva,Cmyk
import { SkyColorpickerCmyk } from './colorpicker-cmyk';
import { SkyColorpickerHsla } from './colorpicker-hsla';
import { SkyColorpickerHsva } from './colorpicker-hsva';
import { SkyColorpickerRgba } from './colorpicker-rgba';

/**
 * Describes the color that users select in the colorpicker.
 */
export interface SkyColorpickerOutput {
  /**
   * An HSLA text value for the selected color.
   */
  hslaText: string;
  /**
   * An RGBA text value for the selected color.
   */
  rgbaText: string;
  /**
   * A CMYK text value for the selected color.
   */
  cmykText: string;
  /**
   * The HSVA values for the selected color.
   */
  hsva: SkyColorpickerHsva;
  /**
   * The RGBA values for the selected color.
   */
  rgba: SkyColorpickerRgba;
  /**
   * The HSLA values for the selected color.
   */
  hsla: SkyColorpickerHsla;
  /**
   * The CMYK values for the selected color.
   */
  cmyk: SkyColorpickerCmyk;
  /**
   * The hex value for the selected color.
   */
  hex: string;
}
