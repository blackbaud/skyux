import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SkySummaryActionBarSecondaryActionsComponent
} from '../actions';

import {
  SkySummaryActionBarComponent
} from '../summary-action-bar.component';

import {
  SkySummaryActionBarModalTestComponent
} from './summary-action-bar-modal.component.fixture';

@Component({
  selector: 'sky-summary-action-bar-test',
  templateUrl: './summary-action-bar.component.fixture.html'
})
export class SkySummaryActionBarTestComponent {

  public disableButtons: boolean;

  public extraActions: boolean;

  public hideMainActionBar: boolean;

  public noSummary: boolean;

  public noSummaryContent: boolean;

  public openedModal: SkySummaryActionBarModalTestComponent;

  @ViewChild(SkySummaryActionBarSecondaryActionsComponent)
  public secondaryActions: SkySummaryActionBarSecondaryActionsComponent;

  @ViewChild(SkySummaryActionBarComponent)
  public summaryActionBar: SkySummaryActionBarComponent;

  constructor(
    private modalService: SkyModalService
  ) { }

  public clickHandler() {
    return true;
  }

  public openModal() {
    let instance = this.modalService.open(SkySummaryActionBarModalTestComponent);
    this.openedModal = instance.componentInstance;
  }

  public openFullScreenModal() {
    let instance = this.modalService.open(SkySummaryActionBarModalTestComponent,
      { fullPage: true });
    this.openedModal = instance.componentInstance;
  }
}
