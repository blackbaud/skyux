/**
 * The options for the `toBeAccessible` vitest matcher.
 */
export interface SkyToBeAccessibleOptions {
  rules: Record<
    string,
    {
      enabled: boolean;
    }
  >;
}
