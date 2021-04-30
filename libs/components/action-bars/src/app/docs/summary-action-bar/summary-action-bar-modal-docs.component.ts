import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-docs.component.html',
  styleUrls: [
    './summary-action-bar-modal-docs.component.scss'
  ]
})
export class SummaryActionBarModalDocsComponent {

  constructor(
    public instance: SkyModalInstance
  ) { }

}
