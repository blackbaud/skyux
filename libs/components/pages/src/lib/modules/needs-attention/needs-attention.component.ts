import { AsyncPipe, NgClass } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
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

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';
import { LinkAsModule } from '../link-as/link-as.module';
import { DisplayPromise } from '../link-list/types/display-promise';
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
  public readonly items = input<SkyActionHubNeedsAttention[]>();

  protected readonly displayItems = computed(
    (): (SkyActionHubNeedsAttention & DisplayPromise)[] => {
      return (this.items() ?? []).map((item: SkyActionHubNeedsAttention) => {
        return {
          ...item,
          display: item.permalink?.url?.includes('://')
            ? this.#resolver
                .resolveHref({ url: item.permalink.url })
                .then((result) => !!result.userHasAccess)
            : Promise.resolve(true),
        };
      });
    },
  );

  readonly #logService = inject(SkyLogService);
  readonly #resolver = inject(SkyHrefResolverService);

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
