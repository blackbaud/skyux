import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { SummaryActionBarComponent } from './summary-action-bar.component';

const routes: Routes = [{ path: '', component: SummaryActionBarComponent }];
@NgModule({
  declarations: [SummaryActionBarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyKeyInfoModule,
    SkySummaryActionBarModule,
  ],
  exports: [SummaryActionBarComponent],
})
export class SummaryActionBarModule {}
