import { SkyuxConfigRemoteEntryReference } from './config-remote-entry-reference';

/**
 * Information about remote modules referenced by this application.
 */
export interface SkyuxConfigRemoteModules {
  /**
   * A collection of remote modules keyed by the remote container name.
   */
  referenced?: Record<string, SkyuxConfigRemoteEntryReference>;
}
