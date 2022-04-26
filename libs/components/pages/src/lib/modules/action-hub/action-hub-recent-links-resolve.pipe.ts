import {
  ChangeDetectorRef,
  OnDestroy,
  Optional,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  SkyRecentlyAccessedGetLinksArgs,
  SkyRecentlyAccessedService,
} from '@skyux/router';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyRecentLink } from './types/recent-link';
import { SkyRecentLinksInput } from './types/recent-links-input';
import { SkyRecentLinksResolved } from './types/recent-links-resolved';

const RECENTLY_ACCESSED_LIMIT = 5;

function getRecentLinksSorted(
  recentLinks: SkyRecentLinksResolved
): SkyRecentLinksResolved {
  if (recentLinks === 'loading') {
    return 'loading';
  }
  if (!recentLinks || recentLinks.length === 0) {
    return [];
  }
  return recentLinks
    .slice(0)
    .sort((a, b) => {
      const aTime =
        a.lastAccessed instanceof Date
          ? a.lastAccessed.toISOString()
          : a.lastAccessed;
      const bTime =
        b.lastAccessed instanceof Date
          ? b.lastAccessed.toISOString()
          : b.lastAccessed;
      if (aTime === bTime) {
        return 0;
      }
      return aTime > bTime ? -1 : 1;
    })
    .slice(0, RECENTLY_ACCESSED_LIMIT);
}

@Pipe({
  name: 'skyActionHubRecentLinksResolve',
  pure: false,
})
export class SkyActionHubRecentLinksResolvePipe
  implements PipeTransform, OnDestroy
{
  #currentRecentLinks: SkyRecentLinksInput;

  #currentRecentLinksResolved: SkyRecentLinksResolved = [];

  #recentlyAccessedSub: Subscription;

  #ngUnsubscribe = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() private recentlyAccessedSvc?: SkyRecentlyAccessedService
  ) {}

  public transform(recentLinks: SkyRecentLinksInput): SkyRecentLinksResolved {
    if (recentLinks !== this.#currentRecentLinks) {
      if (this.#recentlyAccessedSub) {
        this.#recentlyAccessedSub.unsubscribe();
      }

      this.#currentRecentLinks = recentLinks;

      const getLinksArgs = recentLinks as SkyRecentlyAccessedGetLinksArgs;

      if (getLinksArgs?.requestedRoutes) {
        this.#resolveRequestedRoutes(getLinksArgs);
      } else {
        this.#updateRecentLinksResolved(recentLinks as SkyRecentLinksResolved);
      }
    }

    return this.#currentRecentLinksResolved;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #resolveRequestedRoutes(args: SkyRecentlyAccessedGetLinksArgs): void {
    if (this.recentlyAccessedSvc) {
      this.#updateRecentLinksResolved('loading');

      this.#recentlyAccessedSub = this.recentlyAccessedSvc
        .getLinks(args)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((result) => {
          this.#recentlyAccessedSub = undefined;

          const recentLinks: SkyRecentLink[] = result.links.map((item) => ({
            label: item.label,
            lastAccessed: item.lastAccessed,
            permalink: {
              url: item.url,
            },
          }));

          this.#updateRecentLinksResolved(recentLinks);
        });
    } else {
      this.#updateRecentLinksResolved([]);
    }
  }

  #updateRecentLinksResolved(
    recentLinksResolved: SkyRecentLinksResolved
  ): void {
    this.#currentRecentLinksResolved =
      getRecentLinksSorted(recentLinksResolved);

    this.changeDetector.markForCheck();
  }
}
