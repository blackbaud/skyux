// Need to add the following to classes which contain static methods.
// See: https://github.com/ng-packagr/ng-packagr/issues/641
// @dynamic
export class SkyFormsUtility {
  /** Coerces a data-bound value (typically a string) to a boolean. */
  public static coerceBooleanProperty(value: any): boolean {
    return value !== undefined && `${value}` !== 'false';
  }
}
