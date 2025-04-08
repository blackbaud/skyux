import { SkyuxConfigRemoteContainerReference } from './config-remote-container-reference';

/**
 * Information about remote modules exposed and/or referenced by this application.
 */
export interface SkyuxConfigRemoteModules {
  /**
   * Whether this application can load remote modules without validating them
   * against the list of `referenced` modules. Disabling this validation could
   * lead to unpredictable behavior and should not be used in most cases.
   */
  allowDynamicLoading?: boolean;
  /**
   * Information about remote modules exposed by this application.
   */
  public?: {
    /**
     * A list of aliases for this application's remote entry.
     */
    containerAliases?: string[];
    /**
     * The version of this application's remote entry.
     */
    containerVersion: number;
    /**
     * A collection of public modules to expose to consuming SPAs. The module
     * names must start with a capital letter.
     */
    modules: Record<string, string>;
  };
  /**
   * A collection of remote containers referenced by this application, keyed by
   * the name of the remote container.
   */
  referenced?: Record<string, SkyuxConfigRemoteContainerReference>;
  /**
   * Information about dependencies that should be shared between containers.
   * The value for each entry should be an object with properties expected by
   * Webpack's `ModuleFederationPlugin` constructor.
   * @see https://webpack.js.org/plugins/module-federation-plugin#sharing-libraries
   */
  shared?: Record<string, unknown>;
}
