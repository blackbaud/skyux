import { NavigationExtras } from '@angular/router';

/**
 * Specifies action items that require attention and directs users to pages
 * where they can resolve them.
 */
export interface SkyActionHubNeedsAttention {
  /**
   * Specifies a bold title to display at the start of the action item.
   */
  title: string;
  /**
   * Specifies de-emphasized text to display after the title.
   */
  message?: string;
  /**
   * Specifies a link to resolve the action item.
   */
  permalink: {
    route?: {
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
}
