import { SkyActionHubNeedsAttention } from './action-hub-needs-attention';

/**
 * A list of actions that users must perform based on business requirements or best practices.
 */
export type SkyActionHubNeedsAttentionInput =
  | SkyActionHubNeedsAttention[]
  | 'loading';
