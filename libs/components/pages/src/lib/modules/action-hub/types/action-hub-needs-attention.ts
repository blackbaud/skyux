import { NavigationExtras } from '@angular/router';

import { SkyActionHubNeedsAttentionClickHandler } from './action-hub-needs-attention-click-handler';

/**
 * Specifies action items that require attention and directs users to pages
 * where they can resolve them.
 */
export interface SkyActionHubNeedsAttention {
  /**
   * The title of the action item.
   */
  title: string;
  /**
   * Text to display after the title.
   * @deprecated Use `title` instead.
   */
  message?: string;
  /**
   * The link to resolve the action item.
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
   * The click handler for the action item.
   */
  click?: SkyActionHubNeedsAttentionClickHandler;
}
