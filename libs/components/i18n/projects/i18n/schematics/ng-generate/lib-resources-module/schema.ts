/**
 * Represents options and flags passed via Angular CLI.
 */
export interface Schema {
  /**
   * The name of the library resources module.
   * This can also be a path relative to the project's source path
   * (e.g., 'my-lib', '/shared/my-lib').
   */
  name: string;

  /**
   * The name of the project to generate the library resources module.
   */
  project?: string;
}
