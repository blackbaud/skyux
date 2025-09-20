import { AsyncPipe, NgClass } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkyLogService, SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyBoxModule } from '@skyux/layout';
import {
  SkyAppLinkModule,
  SkyHrefModule,
  SkyHrefResolverService,
} from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { forkJoin, from, map, of, startWith, switchMap } from 'rxjs';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';
import { LinkAsModule } from '../link-as/link-as.module';
import { SkyPagesResourcesModule } from '../shared/sky-pages-resources.module';

/**
 * @internal
 */
@Component({
  selector: 'sky-needs-attention',
  templateUrl: './needs-attention.component.html',
  styleUrls: ['./needs-attention.component.scss'],
  imports: [
    SkyAppLinkModule,
    SkyBoxModule,
    SkyHrefModule,
    SkyIconModule,
    SkyPagesResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
    SkyWaitModule,
    LinkAsModule,
    NgClass,
    AsyncPipe,
  ],
})
export class SkyNeedsAttentionComponent {
  public readonly items = input<SkyActionHubNeedsAttention[]>([]);

  protected readonly displayItems = toObservable<SkyActionHubNeedsAttention[]>(
    this.items,
  ).pipe(
    switchMap((items) => {
      if (!items?.length) {
        return of([] as SkyActionHubNeedsAttention[]);
      }
      return forkJoin(
        items.map((item) => {
          if (item.permalink?.url?.includes('://')) {
            if (!this.#resolver) {
              this.#logService.error(
                `SkyHrefResolverService is required but was not provided. Unable to resolve ${item.permalink.url}`,
              );
              return of(undefined);
            }
            return from(
              this.#resolver.resolveHref({ url: item.permalink.url }),
            ).pipe(map((result) => (result.userHasAccess ? item : undefined)));
          }
          return of(item);
        }),
      ).pipe(map((items) => items.filter(Boolean)));
    }),
    startWith([] as SkyActionHubNeedsAttention[]),
  );
  protected readonly displayItemsTrackByFn = (
    item: SkyActionHubNeedsAttention | undefined,
  ): string => item?.title ?? Math.round(Math.random() * 1e8).toString(36);

  readonly #logService = inject(SkyLogService);
  readonly #resolver = inject(SkyHrefResolverService, { optional: true });

  constructor() {
    effect(() => {
      const value = this.items();
      if (value?.some((c: SkyActionHubNeedsAttention) => c.message)) {
        this.#logService.deprecated(`SkyActionHubNeedsAttention.message`, {
          deprecationMajorVersion: 7,
          replacementRecommendation: 'Use `title` instead.',
          moreInfoUrl:
            'https://developer.blackbaud.com/skyux/components/action-hub?docs-active-tab=development#interface-skyactionhubneedsattention',
        });
      }
    });
  }
}
