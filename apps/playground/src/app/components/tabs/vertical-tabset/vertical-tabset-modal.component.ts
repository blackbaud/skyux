import { Component } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

@Component({
  selector: 'app-vertical-tabset-modal',
  templateUrl: './vertical-tabset-modal.component.html',
  imports: [SkyModalModule, SkyVerticalTabsetModule],
})
export class VerticalTabsetModalComponent {
  public maintainTabContent = false;

  constructor(public instance: SkyModalInstance) {}
}
