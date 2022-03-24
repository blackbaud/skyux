import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-summary-action-bar-modal',
  templateUrl: './summary-action-bar-modal.component.html',
  styleUrls: ['./summary-action-bar-modal.component.scss'],
})
export class SummaryActionBarModalComponent {
  constructor(public instance: SkyModalInstance) {}

  public printHello() {
    console.log('hello');
  }
}
