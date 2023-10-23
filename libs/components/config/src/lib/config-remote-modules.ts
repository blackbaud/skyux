import { SkyuxConfigRemoteContainerReference } from './config-remote-container-reference';

/**
 * Information about remote modules referenced by this application.
 */
export interface SkyuxConfigRemoteModules {
  /**
   * A collection of remote modules keyed by the remote container name.
   */
  referenced?: Record<string, SkyuxConfigRemoteContainerReference>;

  /**
   * Whether this application can load remote modules without validating
   * them against the list of `referenced` modules. Disabling this validation
   * could lead to unpredictable behavior and should not be used in most cases.
   */
  allowDynamicLoading?: boolean;
}
