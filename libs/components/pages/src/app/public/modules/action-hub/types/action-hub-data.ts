import { SkyActionHubNeedsAttention } from './action-hub-needs-attention';
import { SkyPageLink } from './page-link';

/**
 * Data object that drives the Action Hub, intended to be loaded from a HTTP service.
 */
export interface SkyActionHubData {
  /**
   * Page title for this screen. Before the title is set, the screen will show as loading.
   */
  title?: string;
  /**
   * List of actions that need attention with link to where the item would be resolved.
   */
  needsAttention?: SkyActionHubNeedsAttention[];
  /**
   * Display the five items most recently accessed by the user in reverse chronological order.
   */
  recentLinks?: SkyPageLink[];
  /**
   * Related links should be displayed in alphabetical order.
   */
  relatedLinks?: SkyPageLink[];
}
