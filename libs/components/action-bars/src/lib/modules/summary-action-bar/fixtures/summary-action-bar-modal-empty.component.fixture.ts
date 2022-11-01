import { Component, OnDestroy } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-empty.component.fixture.html',
})
export class SkySummaryActionBarModalEmptyTestComponent implements OnDestroy {
  #modal: SkyModalInstance | undefined;
  #modalService: SkyModalService;

  constructor(
    public instance: SkyModalInstance,
    modalService: SkyModalService
  ) {
    this.#modalService = modalService;
  }

  public ngOnDestroy(): void {
    this.#modal?.close();
    this.#modalService.dispose();
  }

  public openModal(): void {
    this.#modal = this.#modalService.open(
      SkySummaryActionBarModalTestComponent
    );
  }
}
