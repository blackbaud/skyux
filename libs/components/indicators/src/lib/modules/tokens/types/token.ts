export interface SkyToken {
  /**
   * Specifies the token's value. The `sky-tokens` component will use its `displayWith`
   * property to determine which of the value's properties to use as the token's label.
   */
  // TODO: in a breaking change, convert this value to `[key: string]: unknown`.
  value: any;
}
