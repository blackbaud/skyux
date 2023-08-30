import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAlertModule } from '@skyux/indicators';
import {
  SkyDefinitionListModule,
  SkyPageModule,
  SkyPageSummaryModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyConfirmModule } from '@skyux/modals';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewPageBoundDemoComponent } from './split-view-page-bound-demo.component';

@NgModule({
  declarations: [SplitViewPageBoundDemoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAlertModule,
    SkyConfirmModule,
    SkyInputBoxModule,
    SkyDefinitionListModule,
    SkyPageModule,
    SkyPageSummaryModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
  ],
  exports: [SplitViewPageBoundDemoComponent],
})
export class SplitViewDemoModule {}
