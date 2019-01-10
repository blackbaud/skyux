import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SkySummaryActionBarModalDemoComponent
} from './summary-action-bar-modal-demo.component';

@Component({
  selector: 'sky-summary-action-bar-demo',
  templateUrl: './summary-action-bar-demo.component.html',
  styleUrls: ['./summary-action-bar-demo.component.scss']
})
export class SkySummaryActionBarDemoComponent {

  constructor(
    private modalService: SkyModalService
  ) { }

  public printHello() {
    console.log('hello');
  }

  public openModal() {
    this.modalService.open(SkySummaryActionBarModalDemoComponent);
  }

  public openFullScreenModal() {
    this.modalService.open(SkySummaryActionBarModalDemoComponent, { fullPage: true });
  }
}
