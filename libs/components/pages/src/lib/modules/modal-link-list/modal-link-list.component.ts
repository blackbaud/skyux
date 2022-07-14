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
  public links: SkyPageModalLinksInput;

  @Input()
  public title: string;

  constructor(private modalService: SkyModalService) {}

  public openModal(link: SkyPageModalLink): void {
    this.modalService.open(link.modal.component, link.modal.config);
  }
}
