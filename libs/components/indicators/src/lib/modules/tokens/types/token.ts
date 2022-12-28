// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SkyToken<T = any> {
  /**
   * The token's value. The `sky-tokens` component will use its `displayWith`
   * property to determine which of the value's properties to use as the token's label.
   */
  value: T;
}
