import { SkyuxConfigRemoteModuleReference } from './config-remote-module-reference';

/**
 * Information about remote modules referenced by this application.
 */
export interface SkyuxConfigRemoteModules {
  /**
   * A collection of remote modules referenced by this application.
   */
  referenced?: SkyuxConfigRemoteModuleReference[];
}
