import { Component, OnDestroy } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-empty.component.fixture.html',
})
export class SkySummaryActionBarModalEmptyTestComponent implements OnDestroy {
  private modal: SkyModalInstance;

  constructor(
    public instance: SkyModalInstance,
    private modalService: SkyModalService
  ) {}

  public ngOnDestroy(): void {
    this.modal.close();
    this.modalService.dispose();
  }

  public openModal() {
    this.modal = this.modalService.open(SkySummaryActionBarModalTestComponent);
  }
}
