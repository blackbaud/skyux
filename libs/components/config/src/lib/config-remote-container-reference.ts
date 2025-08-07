/**
 * Information about a referenced remote container.
 */
export interface SkyuxConfigRemoteContainerReference {
  /**
   * A list of module names referenced by this application.
   */
  modules: string[];

  /**
   * The version of the referenced SPA's remote entry.
   */
  containerVersion: number;
}
