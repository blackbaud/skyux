import { NavigationExtras } from '@angular/router';

/**
 * Displays links to related information or recently accessed items.
 */
export interface SkyPageLink {
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
