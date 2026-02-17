export type SkyActionHubNeedsAttentionClickHandler = (
  _: SkyActionHubNeedsAttentionClickHandlerArgs,
) => void;

export interface SkyActionHubNeedsAttentionClickHandlerArgs {
  /**
   * The `SkyPageLink`, `SkyPageModalLink`, or `SkyRecentLink` that was clicked.
   */
  item: unknown;
}
