import { Component, Input } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

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

  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public openModal(link: SkyPageModalLink): void {
    const modal = link.modal;

    if (modal) {
      this.#modalService.open(modal.component, modal.config);
    }
  }
}
