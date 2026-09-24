import { NavigationExtras } from '@angular/router';

/**
 * Specifies an Angular router link with the `route` property or a direct
 * link with the `url` property. If it provides both, the button uses
 * the `route` property.
 */
export interface SkyButtonPermalink {
  /**
   * The Angular router link for the button. This property accepts a
   * custom object with a `commands` property to specify router commands and an `extras`
   * property to specify
   * [Angular `NavigationExtras`](https://angular.dev/api/router/NavigationExtras).
   * This property passes the following properties:
   * - `permalink.route?.extras?.fragment` to
   * [`fragment`](https://angular.dev/api/router/NavigationExtras#fragment)
   * - `permalink.route?.extras?.queryParams` to
   * [`queryParams`](https://angular.dev/api/router/NavigationExtras#queryParams)
   * - `permalink.route?.extras?.queryParamsHandling` to
   * [`queryParamsHandling`](https://angular.dev/api/router/NavigationExtras#queryParamsHandling)
   * - `permalink.route?.commands` to
   * [`routerLink`](https://angular.dev/api/router/RouterLink)
   */
  route?: {
    commands?: unknown[] | string;
    extras?: NavigationExtras;
  };
  /**
   * The direct link for the button.
   */
  url?: string;
}
