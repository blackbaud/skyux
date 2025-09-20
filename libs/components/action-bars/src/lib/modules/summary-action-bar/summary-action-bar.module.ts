import { NgModule } from '@angular/core';

import { SkySummaryActionBarActionsComponent } from './actions/summary-action-bar-actions.component';
import { SkySummaryActionBarCancelComponent } from './actions/summary-action-bar-cancel.component';
import { SkySummaryActionBarPrimaryActionComponent } from './actions/summary-action-bar-primary-action.component';
import { SkySummaryActionBarSecondaryActionComponent } from './actions/summary-action-bar-secondary-action.component';
import { SkySummaryActionBarSecondaryActionsComponent } from './actions/summary-action-bar-secondary-actions.component';
import { SkySummaryActionBarComponent } from './summary-action-bar.component';
import { SkySummaryActionBarSummaryComponent } from './summary/summary-action-bar-summary.component';

@NgModule({
  imports: [
    SkySummaryActionBarActionsComponent,
    SkySummaryActionBarCancelComponent,
    SkySummaryActionBarComponent,
    SkySummaryActionBarPrimaryActionComponent,
    SkySummaryActionBarSecondaryActionComponent,
    SkySummaryActionBarSecondaryActionsComponent,
    SkySummaryActionBarSummaryComponent,
  ],
  exports: [
    SkySummaryActionBarComponent,
    SkySummaryActionBarActionsComponent,
    SkySummaryActionBarCancelComponent,
    SkySummaryActionBarPrimaryActionComponent,
    SkySummaryActionBarSecondaryActionComponent,
    SkySummaryActionBarSecondaryActionsComponent,
    SkySummaryActionBarSummaryComponent,
  ],
})
export class SkySummaryActionBarModule {}
