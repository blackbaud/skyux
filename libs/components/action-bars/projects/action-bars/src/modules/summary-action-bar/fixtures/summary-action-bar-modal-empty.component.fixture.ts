import { Component } from '@angular/core';

import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-empty.component.fixture.html',
})
export class SkySummaryActionBarModalEmptyTestComponent {
  constructor(
    public instance: SkyModalInstance,
    private modalService: SkyModalService
  ) {}

  public openModal() {
    this.modalService.open(SkySummaryActionBarModalTestComponent);
  }
}
