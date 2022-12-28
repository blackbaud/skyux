import { SkyToken } from './token';

export interface SkyTokenSelectedEventArgs<T = any> {
  /**
   * The currently selected token.
   */
  token?: SkyToken<T>;
}
