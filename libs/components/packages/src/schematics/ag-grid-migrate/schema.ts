/**
 * Represents options passed via Angular CLI.
 */
export interface Schema {
  /**
   * Path to the source root of the project. Defaults to the current directory.
   */
  sourceRoot?: string;
  /**
   * The version of AG Grid to migrate from. Defaults to the version found in the project's package-lock.json.
   */
  from?: string;
}
