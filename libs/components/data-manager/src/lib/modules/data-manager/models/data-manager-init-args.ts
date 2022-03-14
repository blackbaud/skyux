import { SkyDataManagerConfig } from './data-manager-config';
import { SkyDataManagerState } from './data-manager-state';

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
   * Specifies a unique key for the UI Config Service to retrieve stored settings from a database.
   * The UI Config Service saves configuration settings for users to preserve the current data state. For more information about the UI Config Service, see [the sticky settings documentation](https://developer.blackbaud.com/skyux/learn/get-started/sticky-settings).
   */
  settingsKey?: string;
}
