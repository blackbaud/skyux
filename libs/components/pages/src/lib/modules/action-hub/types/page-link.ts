import { NavigationExtras } from '@angular/router';

import { SkyPageLinkInterface } from './page-link-interface';

/**
 * Displays links to related information or recently accessed items.
 */
export interface SkyPageLink extends SkyPageLinkInterface {
  /**
   * Specifies the link text.
   */
  label: string;
  /**
   * Specifies the link destination.
   */
  permalink: {
    route?: {
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
}
