export { SkyColorpickerModule } from './lib/modules/colorpicker/colorpicker.module';
export type { SkyColorpickerChangeAxis } from './lib/modules/colorpicker/types/colorpicker-axis';
export type { SkyColorpickerCmyk } from './lib/modules/colorpicker/types/colorpicker-cmyk';
export type { SkyColorpickerChangeColor } from './lib/modules/colorpicker/types/colorpicker-color';
export type { SkyColorpickerHsla } from './lib/modules/colorpicker/types/colorpicker-hsla';
export type { SkyColorpickerHsva } from './lib/modules/colorpicker/types/colorpicker-hsva';
export type { SkyColorpickerMessage } from './lib/modules/colorpicker/types/colorpicker-message';
export { SkyColorpickerMessageType } from './lib/modules/colorpicker/types/colorpicker-message-type';
export type { SkyColorpickerOutput } from './lib/modules/colorpicker/types/colorpicker-output';
export type { SkyColorpickerResult } from './lib/modules/colorpicker/types/colorpicker-result';
export type { SkyColorpickerRgba } from './lib/modules/colorpicker/types/colorpicker-rgba';

// Components and directives must be exported to support Angular's "partial" Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyColorpickerInputDirective as λ2 } from './lib/modules/colorpicker/colorpicker-input.directive';
export { SkyColorpickerComponent as λ1 } from './lib/modules/colorpicker/colorpicker.component';
