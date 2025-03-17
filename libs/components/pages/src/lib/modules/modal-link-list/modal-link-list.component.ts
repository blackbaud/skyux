import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  isStandalone,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalLegacyService, SkyModalService } from '@skyux/modals';
import {
  SkyAppLinkModule,
  SkyHrefModule,
  SkyHrefResolverService,
} from '@skyux/router';

import { SkyPageModalLink } from '../action-hub/types/page-modal-link';
import { SkyPageModalLinksInput } from '../action-hub/types/page-modal-links-input';
import { LinkAsModule } from '../link-as/link-as.module';
import { DisplayPromise } from '../link-list/types/display-promise';

/**
 * A component that displays a list of links such as within a `<sky-page-links>` component.
 */
@Component({
  selector: 'sky-modal-link-list',
  templateUrl: './modal-link-list.component.html',
  styleUrls: ['./modal-link-list.component.scss'],
  imports: [
    SkyAppLinkModule,
    SkyHrefModule,
    SkyWaitModule,
    LinkAsModule,
    AsyncPipe,
    NgTemplateOutlet,
  ],
})
export class SkyModalLinkListComponent {
  /**
   * Option to pass links as an array of `SkyPageModalLink` objects or `'loading'` to display a loading indicator.
   */
  public readonly links = input<SkyPageModalLinksInput>();

  /**
   * The text to display as the list's heading.
   */
  public readonly headingText = input<string>();

  protected readonly linksArray = computed<
    (SkyPageModalLink & DisplayPromise)[]
  >(() => {
    const links = this.links();
    if (Array.isArray(links)) {
      return links.map((link) => {
        return {
          ...link,
          display: link.permalink?.url?.includes('://')
            ? this.#resolver
                .resolveHref({ url: link.permalink.url })
                .then((result) => !!result.userHasAccess)
            : Promise.resolve(true),
        };
      });
    }
    return [];
  });

  readonly #logger = inject(SkyLogService, { optional: true });
  readonly #modalSvc = inject(SkyModalService);
  readonly #resolver = inject(SkyHrefResolverService);

  protected openModal(link: SkyPageModalLink): void {
    const modal = link.modal;

    if (modal) {
      if (
        !(this.#modalSvc instanceof SkyModalLegacyService) &&
        !isStandalone(modal.component)
      ) {
        this.#logger?.deprecated(
          'SkyPageModalLink.modal.component not standalone',
          {
            deprecationMajorVersion: 9,
            replacementRecommendation: `The SkyPageModalLink.modal.component must be a standalone component in order to receive the right dependency injector context.`,
          },
        );
      }
      this.#modalSvc.open(modal.component, modal.config);
    }
  }
}
