import { Component, OnDestroy, ViewChild } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { SkySummaryActionBarSecondaryActionsComponent } from '../actions/summary-action-bar-secondary-actions.component';
import { SkySummaryActionBarError } from '../errors/summary-action-bar-error';
import { SkySummaryActionBarComponent } from '../summary-action-bar.component';
import { SkySummaryActionBarError } from '../types/summary-action-bar-error';

import { SkySummaryActionBarModalEmptyTestComponent } from './summary-action-bar-modal-empty.component.fixture';
import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-summary-action-bar-test',
  templateUrl: './summary-action-bar.component.fixture.html',
  standalone: false,
})
export class SkySummaryActionBarTestComponent implements OnDestroy {
  public disableButtons = false;

  public extraActions = false;

  public formErrors: SkySummaryActionBarError[] | undefined = undefined;

  public hideMainActionBar = false;

  public showSecondaryActionBar = false;

  public noSummary = false;

  public noSummaryContent = false;

  public openedModal: SkySummaryActionBarModalTestComponent | undefined;

  @ViewChild(SkySummaryActionBarSecondaryActionsComponent)
  public secondaryActions:
    | SkySummaryActionBarSecondaryActionsComponent
    | undefined;

  @ViewChild(SkySummaryActionBarComponent)
  public summaryActionBar: SkySummaryActionBarComponent | undefined;

  #modalInstance: SkyModalInstance | undefined;
  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public ngOnDestroy(): void {
    this.#closeModal();
  }

  public clickHandler(): boolean {
    return true;
  }

  public openActionBarModal(): void {
    this.#closeModal();

    this.#modalInstance = this.#modalService.open(
      SkySummaryActionBarModalTestComponent,
    );

    this.openedModal = this.#modalInstance.componentInstance;
  }

  public openEmptyModal(): void {
    this.#closeModal();

    this.#modalInstance = this.#modalService.open(
      SkySummaryActionBarModalEmptyTestComponent,
    );

    this.openedModal = this.#modalInstance.componentInstance;
  }

  public openFullScreenModal(): void {
    this.#closeModal();

    this.#modalInstance = this.#modalService.open(
      SkySummaryActionBarModalTestComponent,
      { fullPage: true },
    );

    this.openedModal = this.#modalInstance.componentInstance;
  }

  public toggleSummary(): void {
    this.noSummary = !this.noSummary;
  }

  #closeModal(): void {
    if (this.#modalInstance) {
      this.#modalInstance.close();
      this.#modalInstance = undefined;
      this.openedModal = undefined;
    }
  }
}
