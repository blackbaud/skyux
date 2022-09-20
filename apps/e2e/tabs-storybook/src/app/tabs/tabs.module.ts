import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyTabsModule } from '@skyux/tabs';

import { TabsComponent } from './tabs.component';

const routes: Routes = [{ path: '', component: TabsComponent }];
@NgModule({
  declarations: [TabsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyTabsModule],
  exports: [TabsComponent],
})
export class TabsModule {}
