/**
 * Information about a referenced remote container.
 */
export interface SkyuxConfigRemoteContainerReference {
  /**
   * A collection of paths to the referenced remote modules.
   */
  modules: string[];

  /**
   * The version of the referenced SPA's remote container.
   */
  containerVersion: number;
}
