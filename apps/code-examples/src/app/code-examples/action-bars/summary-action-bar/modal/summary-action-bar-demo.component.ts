import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { SummaryActionBarModalDemoComponent } from './summary-action-bar-modal-demo.component';

@Component({
  selector: 'app-summary-action-bar-demo',
  templateUrl: './summary-action-bar-demo.component.html',
  styles: [
    `
      sky-key-info {
        margin-right: 20px;
      }
    `,
  ],
})
export class SummaryActionBarDemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  protected openModal(): void {
    this.#modalSvc.open(SummaryActionBarModalDemoComponent, {
      size: 'large',
    });
  }
}
