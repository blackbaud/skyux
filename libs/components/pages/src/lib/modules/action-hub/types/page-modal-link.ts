import { NavigationExtras } from '@angular/router';
import { SkyModalConfigurationInterface } from '@skyux/modals';

import { SkyPageLinkInterface } from './page-link-interface';
import { SkyPageModalLinkClickHandler } from './page-modal-link-click-handler';

/**
 * Displays links to related information or recently accessed items.
 */
export interface SkyPageModalLink extends SkyPageLinkInterface {
  /**
   * The link destination.
   */
  permalink?: {
    route?: {
      commands: any[];
      extras?: NavigationExtras;
    };
    url?: string;
  };
  /**
   * The modal parameters.
   */
  modal?: {
    component: any;
    config?: SkyModalConfigurationInterface;
  };
  /**
   * The click handler for the link, which should be used to open a modal dialog.
   */
  click?: SkyPageModalLinkClickHandler;
}
