type digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0';
type MajorVersionNumber = `${digit | ''}${digit | ''}${digit}`;
/**
 * Represents options passed via Angular CLI.
 */
export interface Schema {
  /**
   * Remove the compat stylesheets for versions at or below the specified version.
   */
  version: 'current' | MajorVersionNumber;
}
