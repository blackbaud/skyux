export interface SkyInlineFormCloseArgs {
  /**
   * Returns a `string` value to explain why users clicked a custom button and initiated a `close` event.
   * This correlates to the `action` in `SkyInlineFormButtonConfig`. The possible values are `cancel`, `delete`, `done`, `save`,
   * and any custom values provided through `action`. The close event is automatic for the standard action values, but
   * consumers must hook into the event for other custom values.
   */
  reason: string;
}
