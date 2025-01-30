import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyPageModule } from '@skyux/pages';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabsComponent } from './vertical-tabs.component';

const routes: Routes = [{ path: '', component: VerticalTabsComponent }];
@NgModule({
  declarations: [VerticalTabsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyPageModule,
    SkyVerticalTabsetModule,
  ],
  exports: [VerticalTabsComponent],
})
export class VerticalTabsModule {}
