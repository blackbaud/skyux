import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  selector: 'app-action-bars-summary-action-bar-modal-example',
  templateUrl: './example.component.html',
})
export class ActionBarsSummaryActionBarModalExampleComponent {
  readonly #modalSvc = inject(SkyModalService);

  protected openModal(): void {
    this.#modalSvc.open(ModalComponent, {
      size: 'large',
    });
  }
}
