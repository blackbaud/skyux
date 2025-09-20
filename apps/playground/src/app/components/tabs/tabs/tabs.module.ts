import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyPageModule } from '@skyux/pages';
import { SkyTabsModule } from '@skyux/tabs';

import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';

@NgModule({
  declarations: [TabsComponent],
  imports: [FormsModule, SkyTabsModule, SkyPageModule, TabsRoutingModule],
})
export class TabsModule {
  public static routes = TabsRoutingModule.routes;
}
