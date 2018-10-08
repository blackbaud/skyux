// spell-checker:ignore Colorpicker, denormalize, Hsla, Hsva,Cmyk
import { SkyColorpickerCmyk } from './colorpicker-cmyk';
import { SkyColorpickerHsla } from './colorpicker-hsla';
import { SkyColorpickerHsva } from './colorpicker-hsva';
import { SkyColorpickerRgba } from './colorpicker-rgba';

export interface SkyColorpickerOutput {
  hslaText: string;
  rgbaText: string;
  cmykText: string;
  hsva: SkyColorpickerHsva;
  rgba: SkyColorpickerRgba;
  hsla: SkyColorpickerHsla;
  cmyk: SkyColorpickerCmyk;
  hex: string;
}
