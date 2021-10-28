import { Component, ViewChild } from '@angular/core';

import { SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarSecondaryActionsComponent } from '../actions/summary-action-bar-secondary-actions.component';

import { SkySummaryActionBarComponent } from '../summary-action-bar.component';

import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';
import { SkySummaryActionBarModalEmptyTestComponent } from './summary-action-bar-modal-empty.component.fixture';

@Component({
  selector: 'sky-summary-action-bar-test',
  templateUrl: './summary-action-bar.component.fixture.html',
})
export class SkySummaryActionBarTestComponent {
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

  constructor(private modalService: SkyModalService) {}

  public clickHandler() {
    return true;
  }

  public openActionBarModal() {
    let instance = this.modalService.open(
      SkySummaryActionBarModalTestComponent
    );
    this.openedModal = instance.componentInstance;
  }

  public openEmptyModal() {
    let instance = this.modalService.open(
      SkySummaryActionBarModalEmptyTestComponent
    );
    this.openedModal = instance.componentInstance;
  }

  public openFullScreenModal() {
    let instance = this.modalService.open(
      SkySummaryActionBarModalTestComponent,
      { fullPage: true }
    );
    this.openedModal = instance.componentInstance;
  }
}
