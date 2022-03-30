import { Component, OnDestroy, ViewChild } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarSecondaryActionsComponent } from '../actions/summary-action-bar-secondary-actions.component';
import { SkySummaryActionBarComponent } from '../summary-action-bar.component';

import { SkySummaryActionBarModalEmptyTestComponent } from './summary-action-bar-modal-empty.component.fixture';
import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-summary-action-bar-test',
  templateUrl: './summary-action-bar.component.fixture.html',
})
export class SkySummaryActionBarTestComponent implements OnDestroy {
  public disableButtons = false;

  public extraActions = false;

  public hideMainActionBar = false;

  public showSecondaryActionBar = false;

  public noSummary = false;

  public noSummaryContent = false;

  public openedModal: SkySummaryActionBarModalTestComponent;

  @ViewChild(SkySummaryActionBarSecondaryActionsComponent)
  public secondaryActions: SkySummaryActionBarSecondaryActionsComponent;

  @ViewChild(SkySummaryActionBarComponent)
  public summaryActionBar: SkySummaryActionBarComponent;

  private modalInstance: SkyModalInstance;

  constructor(private modalService: SkyModalService) {}

  public ngOnDestroy(): void {
    this.closeModal();
  }

  public clickHandler() {
    return true;
  }

  public openActionBarModal() {
    this.closeModal();

    this.modalInstance = this.modalService.open(
      SkySummaryActionBarModalTestComponent
    );

    this.openedModal = this.modalInstance.componentInstance;
  }

  public openEmptyModal() {
    this.closeModal();

    this.modalInstance = this.modalService.open(
      SkySummaryActionBarModalEmptyTestComponent
    );

    this.openedModal = this.modalInstance.componentInstance;
  }

  public openFullScreenModal() {
    this.closeModal();

    this.modalInstance = this.modalService.open(
      SkySummaryActionBarModalTestComponent,
      { fullPage: true }
    );

    this.openedModal = this.modalInstance.componentInstance;
  }

  public toggleSummary(): void {
    this.noSummary = !this.noSummary;
  }

  private closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.close();
      this.modalInstance = undefined;
      this.openedModal = undefined;
    }
  }
}
