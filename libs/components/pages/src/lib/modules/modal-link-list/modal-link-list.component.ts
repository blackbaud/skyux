import {
  Component,
  computed,
  inject,
  input,
  isStandalone,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyModalLegacyService, SkyModalService } from '@skyux/modals';

import { SkyPageModalLink } from '../action-hub/types/page-modal-link';
import { SkyPageModalLinksInput } from '../action-hub/types/page-modal-links-input';

/**
 * A component that displays a list of links such as within a `<sky-page-links>` component.
 */
@Component({
  selector: 'sky-modal-link-list',
  templateUrl: './modal-link-list.component.html',
  styleUrls: ['./modal-link-list.component.scss'],
  standalone: false,
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

  protected readonly linksArray = computed<SkyPageModalLink[]>(() => {
    const links = this.links();
    if (Array.isArray(links)) {
      return links;
    } else {
      return [];
    }
  });

  readonly #logger = inject(SkyLogService, { optional: true });
  readonly #modalSvc = inject(SkyModalService);

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
