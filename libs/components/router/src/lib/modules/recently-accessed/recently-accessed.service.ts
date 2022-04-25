import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SkyRecentlyAccessedAddLinkArgs } from './recently-accessed-add-link-args';
import { SkyRecentlyAccessedAddLinkResult } from './recently-accessed-add-link-result';
import { SkyRecentlyAccessedAddRouteArgs } from './recently-accessed-add-route-args';
import { SkyRecentlyAccessedGetLinksArgs } from './recently-accessed-get-links-args';
import { SkyRecentlyAccessedLinkList } from './recently-accessed-link-list';

@Injectable()
export abstract class SkyRecentlyAccessedService {
  public abstract addRoute(
    args: SkyRecentlyAccessedAddRouteArgs
  ): Observable<SkyRecentlyAccessedAddLinkResult>;

  public abstract addLink(
    args: SkyRecentlyAccessedAddLinkArgs
  ): Observable<SkyRecentlyAccessedAddLinkResult>;

  public abstract getLinks(
    args: SkyRecentlyAccessedGetLinksArgs
  ): Observable<SkyRecentlyAccessedLinkList>;
}
