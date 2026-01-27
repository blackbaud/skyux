import { NavigationExtras } from '@angular/router';

export interface SkyFlyoutPermalink {
  /**
   * The text label for the permalink button.
   */
  label?: string;

  /**
   * The object that represents the
   * [Angular application route](https://angular.dev/api/router/Router#navigate).
   * The object includes two properties that are mapped to Angular's
   * `Router.navigate(commands, extras?)` method.
   */
  route?: {
    commands: any[];
    extras?: NavigationExtras;
  };

  /**
   * The external URL for the permalink.
   */
  url?: string;
}
