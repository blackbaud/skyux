/**
 * Configuration for projects that expose remote modules.
 * @experimental
 */
export type SkyuxConfigRemoteModulesPublic = {
  /**
   * Information about remote modules exposed by this application.
   */
  public?: {
    /**
     * The version of this application's remote entry.
     */
    containerVersion: number;

    /**
     * A collection of public modules to expose to consuming SPAs.
     * The module names must start with \"./\" and a capital letter.
     */
    modules: {
      [moduleName: string]: string;
    };
  };
};

/**
 * Information about remote modules referenced by this application.
 * @experimental
 */
export type SkyuxConfigRemoteModulesReferenced = {
  /**
   * A collection of remote modules keyed by the remote container name.
   */
  referenced?: {
    [appName: string]: {
      /**
       * The version of the referenced SPA's remote container.
       */
      containerVersion: number;

      /**
       * A collection of paths to the referenced remote modules.
       */
      modules: string[];
    };
  };
};

/**
 * Configuration for projects that consume or expose remote modules.
 * @experimental
 */
export type SkyuxConfigRemoteModules = SkyuxConfigRemoteModulesPublic &
  SkyuxConfigRemoteModulesReferenced & {
    /**
     * Information about dependencies that should be shared between containers.
     * The value for each entry should be an object with properties expected by
     * Webpack's 'ModuleFederationPlugin' constructor.
     * @see https://webpack.js.org/plugins/module-federation-plugin#sharing-libraries
     */
    shared?: { [packageName: string]: unknown };
  };
