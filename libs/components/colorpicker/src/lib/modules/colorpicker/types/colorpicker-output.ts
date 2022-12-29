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
   * Specifies an HSLA text value for the selected color.
   */
  hslaText: string;
  /**
   * Specifies an RGBA text value for the selected color.
   */
  rgbaText: string;
  /**
   * Specifies a CMYK text value for the selected color.
   */
  cmykText: string;
  /**
   * Specifies the HSVA values for the selected color.
   */
  hsva: SkyColorpickerHsva;
  /**
   * Specifies the RGBA values for the selected color.
   */
  rgba: SkyColorpickerRgba;
  /**
   * Specifies the HSLA values for the selected color.
   */
  hsla: SkyColorpickerHsla;
  /**
   * Specifies the CMYK values for the selected color.
   */
  cmyk: SkyColorpickerCmyk;
  /**
   * Specifies the hex value for the selected color.
   */
  hex: string;
}
