import { SkyColorpickerOutput } from './colorpicker-output';

/**
 * The color that users apply when they select Apply in the colorpicker.
 */
export interface SkyColorpickerResult {
  /**
   * Describes the color that users select in the colorpicker.
   */
  color: SkyColorpickerOutput;
}
