/**
 * Represents options passed via Angular CLI.
 */
export interface Schema {
  /**
   * The name of the project to add polyfills to.
   */
  sourceRoot?: string;
  /**
   * The version of AG Grid to migrate from. Defaults to the version found in the project's package-lock.json.
   */
  from?: string;
}
