import { NavigationExtras } from '@angular/router';

export interface SkyFlyoutPermalink {
  /**
   * A text label for the permalink button.
   */
  label?: string;

  /**
   * An object that represents the
   * [Angular application route](https://angular.io/api/router/Router#navigate).
   * The object includes two properties that are mapped to Angular's
   * `Router.navigate(commands, extras?)` method.
   */
  route?: {
    commands: any[];
    extras?: NavigationExtras;
  };

  /**
   * An external URL for the permalink.
   */
  url?: string;
}
