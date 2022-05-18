import { ActivatedRouteSnapshot } from '@angular/router';

/**
 * Parameters for adding a recently accessed link via an Angular route.
 */
export interface SkyRecentlyAccessedAddRouteArgs {
  /**
   * The route to the link.
   */
  route: ActivatedRouteSnapshot;
}
