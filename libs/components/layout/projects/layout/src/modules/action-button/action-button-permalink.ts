import {
  NavigationExtras
} from '@angular/router';

/**
 * Specifies an Angular router link with the `route` property or a direct
 * link with the `url` property. If it provides both, the action button uses
 * the `route` property.
 */
export interface SkyActionButtonPermalink {
/**
 * Specifies an Angular router link for the action button. This property accepts a
 * custom object with a `commands` property to specify router commands and an `extras`
 * property to specify
 * [Angular `NavigationExtras`](https://angular.io/api/router/NavigationExtras).
 * This property passes the following properties:
 * - `permalink.route?.extras?.fragment` to
 * [`fragment`](https://angular.io/api/router/NavigationExtras#fragment)
 * - `permalink.route?.extras?.queryParams` to
 * [`queryParams`](https://angular.io/api/router/NavigationExtras#queryParams)
 * - `permalink.route?.extras?.queryParamsHandling` to
 * [`queryParamsHandling`](https://angular.io/api/router/NavigationExtras#queryParamsHandling)
 * - `permalink.route?.commands` to
 * [`routerLink`](https://angular.io/api/router/RouterLink)
 */
  route?: {
    commands: any[],
    extras?: NavigationExtras
  };
  /**
   * Specifies a direct link for the action button.
   */
  url?: string;
}
