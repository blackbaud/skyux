/**
 * Configuration for applications that expose remote modules.
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
     * @example```
     * {
     *   "modules": {
     *     "./MyComponent": "src/app/shared/my.component.ts"
     *   }
     * }
     * ```
     */
    modules: Record<string, string>;
  };
};
