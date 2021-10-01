import {
  SkyDataManagerConfig
} from './data-manager-config';

import {
  SkyDataManagerState
} from './data-manager-state';

export interface SkyDataManagerInitArgs {
  /**
   * The initial active view's ID.
   * @required
   */
  activeViewId: string;
  /**
   * The initial configuration for the data manager. See the SkyDataManagerConfig interface.
   * @required
   */
  dataManagerConfig: SkyDataManagerConfig;
  /**
   * The data state used if no settings key is provided or if no data state is saved in the SKY UI
   * config service for the user. See the SkyDataManagerState interface.
   * @required
   */
  defaultDataState: SkyDataManagerState;
  /**
   * The sticky settings key that the current data state for each user is saved under in the SKY UI config service.
   */
  settingsKey?: string;
}
