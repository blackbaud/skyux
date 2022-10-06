import { SkyToken } from './token';

export interface SkyTokenSelectedEventArgs<T = any> {
  /**
   * Indicates the currently selected token.
   */
  token?: SkyToken<T>;
}
