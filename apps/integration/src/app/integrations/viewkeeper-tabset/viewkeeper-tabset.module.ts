import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyTabsModule } from '@skyux/tabs';

import { ViewkeeperTabsetRoutingModule } from './viewkeeper-tabset-routing.module';
import { ViewkeeperTabsetComponent } from './viewkeeper-tabset.component';

@NgModule({
  declarations: [ViewkeeperTabsetComponent],
  imports: [
    CommonModule,
    SkyTabsModule,
    SkyViewkeeperModule,
    ViewkeeperTabsetRoutingModule,
  ],
})
export class ViewkeeperTabsetModule {}
