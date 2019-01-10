import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-demo.component.html',
  styleUrls: ['./summary-action-bar-modal-demo.component.scss']
})
export class SkySummaryActionBarModalDemoComponent {
  constructor(
    public instance: SkyModalInstance
  ) { }

  public printHello() {
    console.log('hello');
  }

}
