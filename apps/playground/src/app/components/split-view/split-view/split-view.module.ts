import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyDefinitionListModule,
  SkyFluidGridModule,
  SkyPageModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkySplitViewModule } from '@skyux/split-view';

import { DataManagerModule } from '../../../shared/data-manager/data-manager.module';
import { LipsumModule } from '../../../shared/lipsum/lipsum.module';

import { SplitViewComponent } from './basic/split-view.component';
import { SplitViewPageBoundComponent } from './page-bound/split-view-page-bound.component';
import { SplitViewRoutingModule } from './split-view-routing.module';

@NgModule({
  declarations: [SplitViewComponent, SplitViewPageBoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDefinitionListModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyPageModule,
    SkyRepeaterModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
    SplitViewRoutingModule,
    LipsumModule,
    DataManagerModule,
  ],
})
export class SplitViewModule {
  public static routes = SplitViewRoutingModule.routes;
}
