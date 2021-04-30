import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SummaryActionBarModalDocsComponent
} from './summary-action-bar-modal-docs.component';

@Component({
  selector: 'app-summary-action-bar-docs',
  templateUrl: './summary-action-bar-docs.component.html'
})
export class SummaryActionBarDocsComponent {

  constructor(
    private modalService: SkyModalService
  ) {}

  public openModal(): void {
    this.modalService.open(SummaryActionBarModalDocsComponent, { size: 'large' });
  }

}
