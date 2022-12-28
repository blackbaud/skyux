// #region imports
import { SkyToastType } from './toast-type';

// #endregion

/**
 * The configuration options to set up a toast.
 */
export interface SkyToastConfig {
  /**
   * A `SkyToastType` type for the toast to determine the color and icon to display.
   */
  type?: SkyToastType;

  /**
   * Whether to automatically close the toast.
   */
  autoClose?: boolean;
}
