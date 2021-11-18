import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { SkySummaryActionBarModule } from '@skyux/action-bars';

import { SkyIdModule } from '@skyux/core';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyAlertModule } from '@skyux/indicators';

import { SkyDefinitionListModule, SkyPageSummaryModule } from '@skyux/layout';

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
    SkyIdModule,
    SkyInputBoxModule,
    SkyDefinitionListModule,
    SkyPageSummaryModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
  ],
  exports: [SplitViewPageBoundDemoComponent],
})
export class SplitViewDemoModule {}
