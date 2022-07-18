import { NavigationExtras } from '@angular/router';
import { SkyModalConfigurationInterface } from '@skyux/modals';

import { SkyPageLinkInterface } from './page-link-interface';

/**
 * Displays links to related information or recently accessed items.
 */
export interface SkyPageModalLink extends SkyPageLinkInterface {
  /**
   * Specifies the link destination.
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
}
