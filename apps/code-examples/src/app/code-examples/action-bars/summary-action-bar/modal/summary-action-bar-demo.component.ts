import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarModalDemoComponent } from './summary-action-bar-modal-demo.component';

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

  public openModal(): void {
    this.#modalSvc.open(SkySummaryActionBarModalDemoComponent, {
      size: 'large',
    });
  }
}
