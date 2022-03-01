// #region imports
import { SkyToastType } from './toast-type';

// #endregion

/**
 * Specifies the configuration options to set up a toast.
 */
export interface SkyToastConfig {
  /**
   * Specifies a `SkyToastType` type for the toast to determine the color and icon to display.
   */
  type?: SkyToastType;

  /**
   * Indicates whether to automatically close the toast.
   */
  autoClose?: boolean;
}
