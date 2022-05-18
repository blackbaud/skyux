import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyRecentlyAccessedAddLinkArgs } from './recently-accessed-add-link-args';
import { SkyRecentlyAccessedAddLinkResult } from './recently-accessed-add-link-result';
import { SkyRecentlyAccessedAddRouteArgs } from './recently-accessed-add-route-args';
import { SkyRecentlyAccessedGetLinksArgs } from './recently-accessed-get-links-args';
import { SkyRecentlyAccessedLinkList } from './recently-accessed-link-list';

/**
 * A service for creating and retrieving recently accessed links.
 */
@Injectable()
export abstract class SkyRecentlyAccessedService {
  /**
   * Adds a recently accessed link based on an Angular route.
   * @param args The route to add.
   */
  public abstract addRoute(
    args: SkyRecentlyAccessedAddRouteArgs
  ): Observable<SkyRecentlyAccessedAddLinkResult>;

  /**
   * Adds a recently accessed link based on metadata about the link.
   * @param args The link to add.
   */
  public abstract addLink(
    args: SkyRecentlyAccessedAddLinkArgs
  ): Observable<SkyRecentlyAccessedAddLinkResult>;

  /**
   * Gets a list of recently accessed links.
   * @param args The links to retrieve.
   */
  public abstract getLinks(
    args: SkyRecentlyAccessedGetLinksArgs
  ): Observable<SkyRecentlyAccessedLinkList>;
}
