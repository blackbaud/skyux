import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewComponent } from './split-view.component';

const routes: Routes = [{ path: '', component: SplitViewComponent }];
@NgModule({
  declarations: [SplitViewComponent],
  imports: [
    RouterModule.forChild(routes),
    SkySplitViewModule,
    CommonModule,
    SkyRepeaterModule,
    SkyDescriptionListModule,
    SkyInputBoxModule,
    SkySummaryActionBarModule,
  ],
  exports: [SplitViewComponent],
})
export class SplitViewModule {}
