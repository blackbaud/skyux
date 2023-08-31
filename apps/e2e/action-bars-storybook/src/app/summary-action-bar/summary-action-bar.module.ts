import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkySplitViewModule } from '@skyux/split-view';
import { SkyTabsModule } from '@skyux/tabs';

import { SummaryActionBarComponent } from './summary-action-bar.component';

const routes: Routes = [{ path: '', component: SummaryActionBarComponent }];
@NgModule({
  declarations: [SummaryActionBarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyKeyInfoModule,
    SkySummaryActionBarModule,
    SkyTabsModule,
    SkySplitViewModule,
  ],
  exports: [SummaryActionBarComponent],
})
export class SummaryActionBarModule {}
