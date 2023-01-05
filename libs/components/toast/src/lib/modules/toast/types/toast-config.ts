// #region imports
import { SkyToastType } from './toast-type';

// #endregion

/**
 * Specifies the configuration options to set up a toast.
 */
export interface SkyToastConfig {
  /**
   * The `SkyToastType` type for the toast to determine the color and icon to display.
   */
  type?: SkyToastType;

  /**
   * Whether to automatically close the toast. Only close toasts
   * automatically if users can access the messages after the toasts close.
   */
  autoClose?: boolean;
}
