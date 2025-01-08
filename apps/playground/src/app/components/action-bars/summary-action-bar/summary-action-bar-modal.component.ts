import { Component } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-summary-action-bar-modal',
  templateUrl: './summary-action-bar-modal.component.html',
  styleUrls: ['./summary-action-bar-modal.component.scss'],
  imports: [SkyKeyInfoModule, SkyModalModule, SkySummaryActionBarModule],
})
export class SummaryActionBarModalComponent {
  constructor(public instance: SkyModalInstance) {}

  public printHello() {
    console.log('hello');
  }
}
