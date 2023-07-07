import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';
import { SkySplitViewModule } from '@skyux/split-view';
import { SkyTabsModule } from '@skyux/tabs';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';
import { SummaryActionBarComponent } from './summary-action-bar.component';

const routes: Routes = [{ path: '', component: SummaryActionBarComponent }];
@NgModule({
  declarations: [SummaryActionBarComponent, SummaryActionBarModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyKeyInfoModule,
    SkySummaryActionBarModule,
    SkyModalModule,
    SkyTabsModule,
    SkySplitViewModule,
  ],
  exports: [SummaryActionBarComponent],
})
export class SummaryActionBarModule {}
