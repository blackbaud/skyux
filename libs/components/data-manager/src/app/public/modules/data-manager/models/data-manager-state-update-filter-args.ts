import {
  SkyDataManagerState
} from './data-manager-state';

/**
 * Optional arguments to pass to `getDataStateUpdates`.
 * Provide either a list of properties to filter on OR a custom comparator.
 */
export interface SkyDataManagerStateUpdateFilterArgs {
  /**
   * A list of `SkyDataManagerState` properties to compare to test if the new `SkyDataManagerState` is distinct from the previous.
   * This allows you to subscribe to changes for only the provided properties.
   */
  properties?: string[];
  /**
   * A comparator function called to test if the new `SkyDataManagerState` is distinct from the previous.
   */
  comparator?: (state1: SkyDataManagerState, state2: SkyDataManagerState) => boolean;
}
