import { SkyuxConfigRemoteContainerReference } from './config-remote-container-reference';

/**
 * Information about remote modules referenced by this application.
 * @experimental
 */
export type SkyuxConfigRemoteModulesReferenced = {
  /**
   * A collection of remote modules keyed by the remote container name.
   */
  referenced?: Record<string, SkyuxConfigRemoteContainerReference>;
};
