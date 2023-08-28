import { Component, Input, inject } from '@angular/core';
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

  readonly #modalLegacySvc = inject(SkyModalLegacyService);
  readonly #modalSvc = inject(SkyModalService);

  /**
   * @deprecated Use the `open` method with a standalone component instead.
   */
  public openModal(link: SkyPageModalLink): void {
    const modal = link.modal;

    if (modal) {
      this.#modalLegacySvc.open(modal.component, modal.config);
    }
  }

  public open(link: SkyPageModalLink): void {
    const modal = link.modal;

    if (modal) {
      this.#modalSvc.open(modal.component, modal.config);
    }
  }
}
