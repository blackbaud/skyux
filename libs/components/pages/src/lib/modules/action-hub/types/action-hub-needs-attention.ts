import { NavigationExtras } from '@angular/router';
import { SkyModalConfigurationInterface } from '@skyux/modals';

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
  permalink?: {
    route?: {
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
  /**
   * Specifies the modal parameters.
   */
  modal?: {
    component: any;
    config?: SkyModalConfigurationInterface;
  };
  /**
   * Specifies a click handler for the action item.
   */
  click?: () => void;
}
