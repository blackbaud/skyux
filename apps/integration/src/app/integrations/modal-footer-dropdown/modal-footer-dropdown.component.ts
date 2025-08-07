import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalFooterDropdownModalComponent } from './modal-footer-dropdown-modal.component';

@Component({
  selector: 'app-modal-footer-dropdown',
  templateUrl: './modal-footer-dropdown.component.html',
  styleUrls: ['./modal-footer-dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class ModalFooterDropdownComponent {
  public isWaiting = false;

  readonly #modalService = inject(SkyModalService);

  public openModal(): void {
    this.#modalService.open(ModalFooterDropdownModalComponent);
  }

  public openLargeModal(): void {
    this.#modalService.open(ModalFooterDropdownModalComponent, {
      size: 'large',
    });
  }

  public openPageModal(): void {
    this.#modalService.open(ModalFooterDropdownModalComponent, {
      fullPage: true,
    });
  }
}
