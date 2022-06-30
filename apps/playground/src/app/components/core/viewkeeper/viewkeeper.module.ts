import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';

import { ViewkeeperRoutingModule } from './viewkeeper-routing.module';
import { ViewkeeperComponent } from './viewkeeper.component';

@NgModule({
  declarations: [ViewkeeperComponent],
  imports: [CommonModule, SkyViewkeeperModule, ViewkeeperRoutingModule],
})
export class ViewkeeperModule {
  public static routes = ViewkeeperRoutingModule.routes;
}
