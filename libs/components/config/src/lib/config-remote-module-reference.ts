/**
 * Information about a referenced remote module.
 */
export interface SkyuxConfigRemoteModuleReference {
  /**
   * The name of the SKY UX SPA containing the remote module.
   */
  app: string;

  /**
   * The path to the remote module.
   */
  exposedModule: string;

  /**
   * The version of the remote module.
   */
  version: number;
}
