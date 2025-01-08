import { Component } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-summary-action-bar-modal',
  templateUrl: './summary-action-bar-modal.component.html',
  imports: [SkyKeyInfoModule, SkyModalModule, SkySummaryActionBarModule],
})
export class SummaryActionBarModalComponent {}
