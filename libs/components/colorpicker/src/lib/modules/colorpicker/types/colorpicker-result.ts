import { SkyColorpickerOutput } from './colorpicker-output';

/**
 * Indicates the color that users apply when they select Apply in the colorpicker.
 */
export interface SkyColorpickerResult {
  /**
   * Describes the color that users select in the colorpicker.
   */
  color: SkyColorpickerOutput;
}
