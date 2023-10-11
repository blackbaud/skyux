/**
 * Information about referenced remote modules.
 */
export interface SkyuxConfigRemoteEntryReference {
  /**
   * The name of the SKY UX SPA containing the referenced remote modules.
   */
  app: string;

  /**
   * A collection of paths to the referenced remote modules.
   */
  exposedModules: string[];

  /**
   * The version of the referenced SPA's remote entry.
   */
  version: number;
}
