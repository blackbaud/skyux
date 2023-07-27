import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyPageModule } from '@skyux/pages';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewPageContentComponent } from './split-view-page-content.component';
import { SplitViewPageFitLayoutDemoComponent } from './split-view-page-fit-layout-demo.component';

@NgModule({
  declarations: [
    SplitViewPageFitLayoutDemoComponent,
    SplitViewPageContentComponent,
  ],
  exports: [SplitViewPageFitLayoutDemoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAlertModule,
    SkyDescriptionListModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
  ],
})
export class SplitViewPageFitLayoutDemoModule {}
