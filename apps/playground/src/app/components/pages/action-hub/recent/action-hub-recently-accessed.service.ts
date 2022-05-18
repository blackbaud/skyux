import { Injectable } from '@angular/core';
import {
  SkyRecentlyAccessedAddLinkResult,
  SkyRecentlyAccessedGetLinksArgs,
  SkyRecentlyAccessedLinkList,
  SkyRecentlyAccessedService,
} from '@skyux/router';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class ActionHubPlaygroundRecentlyAccessedService extends SkyRecentlyAccessedService {
  public getLinks(
    args: SkyRecentlyAccessedGetLinksArgs
  ): Observable<SkyRecentlyAccessedLinkList> {
    const result: SkyRecentlyAccessedLinkList = {
      links: [],
    };

    for (const route of args.requestedRoutes) {
      switch (route.app) {
        case 'foo':
          if (route.route === '/') {
            result.links.push({
              label: 'Foo',
              lastAccessed: new Date('2022-03-08'),
              url: 'https://example.com/foo',
            });
          }
          break;
        case 'bar':
          if (route.route === '/') {
            result.links.push({
              label: 'Bar',
              lastAccessed: new Date('2022-03-08'),
              url: 'https://example.com/bar',
            });
          }
      }
    }

    // Simulate network latency.
    return of(result).pipe(delay(500));
  }

  public addLink(): Observable<SkyRecentlyAccessedAddLinkResult> {
    return of({
      id: '',
    });
  }

  public addRoute(): Observable<SkyRecentlyAccessedAddLinkResult> {
    return of({
      id: '',
    });
  }
}
