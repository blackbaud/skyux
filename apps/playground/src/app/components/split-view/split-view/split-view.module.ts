import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyDefinitionListModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewComponent } from './basic/split-view.component';
import { SplitViewPageBoundComponent } from './page-bound/split-view-page-bound.compoennt';
import { SplitViewRoutingModule } from './split-view-routing.module';

@NgModule({
  declarations: [SplitViewComponent, SplitViewPageBoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDefinitionListModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
    SplitViewRoutingModule,
  ],
})
export class SplitViewModule {}
