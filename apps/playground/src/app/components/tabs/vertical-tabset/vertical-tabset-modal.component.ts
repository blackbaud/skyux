import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-vertical-tabset-modal',
  templateUrl: './vertical-tabset-modal.component.html',
})
export class VerticalTabsetModalComponent {
  public maintainTabContent = false;

  constructor(public instance: SkyModalInstance) {}
}
