import { NavigationExtras } from '@angular/router';

import { SkyActionHubNeedsAttentionClickHandler } from './action-hub-needs-attention-click-handler';

/**
 * Action items that require attention and directs users to pages
 * where they can resolve them.
 */
export interface SkyActionHubNeedsAttention {
  /**
   * A bold title to display at the start of the action item.
   */
  title: string;
  /**
   * De-emphasized text to display after the title.
   */
  message?: string;
  /**
   * A link to resolve the action item.
   */
  permalink?: {
    route?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
  /**
   * A click handler for the action item.
   */
  click?: SkyActionHubNeedsAttentionClickHandler;
}
