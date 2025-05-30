import { Component, inject } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

import { SABModalContext } from './summary-action-bar.component';

@Component({
  selector: 'app-summary-action-bar-modal',
  templateUrl: './summary-action-bar-modal.component.html',
  imports: [SkyKeyInfoModule, SkyModalModule, SkySummaryActionBarModule],
})
export class SummaryActionBarModalComponent {
  public context = inject(SABModalContext, { optional: true });
}
