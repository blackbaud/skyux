export interface SkyInlineFormCloseArgs {
  /**
   * Returns a `string` value that explains why the inline form closed.
   * The possible values are `cancel`, `delete`, `done`, and `save`.
   */
  reason: string;
}
