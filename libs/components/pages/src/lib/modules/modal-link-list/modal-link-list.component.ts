import { Component, Input, inject, isStandalone } from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyModalLegacyService, SkyModalService } from '@skyux/modals';

import { SkyPageModalLink } from '../action-hub/types/page-modal-link';
import { SkyPageModalLinksInput } from '../action-hub/types/page-modal-links-input';

@Component({
  selector: 'sky-modal-link-list',
  templateUrl: './modal-link-list.component.html',
  styleUrls: ['./modal-link-list.component.scss'],
})
export class SkyModalLinkListComponent {
  @Input()
  public set links(value: SkyPageModalLinksInput | undefined) {
    this.#_links = value;
    this.linksArray = Array.isArray(value) ? value : [];
  }

  public get links(): SkyPageModalLinksInput | undefined {
    return this.#_links;
  }

  @Input()
  public title: string | undefined;

  public linksArray: SkyPageModalLink[] = [];

  #_links: SkyPageModalLinksInput | undefined;

  readonly #logger = inject(SkyLogService, { optional: true });
  readonly #modalSvc = inject(SkyModalService);

  public openModal(link: SkyPageModalLink): void {
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
