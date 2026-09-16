import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { DockedInModalComponent } from './docked-in-modal.component';

@Component({
  selector: 'app-docked-in-modal-button',
  template: `<button
    type="button"
    class="sky-btn sky-btn-default"
    (click)="openModal()"
  >
    Data grid docked in a modal
  </button>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DockedInModalButtonComponent {
  readonly #modalService = inject(SkyModalService);

  protected openModal(): void {
    this.#modalService.open(DockedInModalComponent, {
      size: 'large',
    });
  }
}
