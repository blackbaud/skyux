export interface SkyInlineFormCloseArgs {
  /**
   * Returns a `string` value to explain why users clicked a custom button and initiated a `close` event.
   * This correlates to either the `action` in `SkyInlineFormButtonConfig` for custom buttons or the standard
   * value of `cancel`, `delete`, `done`, or `save` for predefined buttons.
   */
  reason: string;
}
