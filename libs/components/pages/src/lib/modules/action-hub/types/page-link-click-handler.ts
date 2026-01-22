import {
  SkyActionHubNeedsAttentionClickHandler,
  SkyActionHubNeedsAttentionClickHandlerArgs,
} from './action-hub-needs-attention-click-handler';

export type SkyPageLinkClickHandler = SkyActionHubNeedsAttentionClickHandler;

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyPageLinkClickHandlerArgs
  extends SkyActionHubNeedsAttentionClickHandlerArgs {}
