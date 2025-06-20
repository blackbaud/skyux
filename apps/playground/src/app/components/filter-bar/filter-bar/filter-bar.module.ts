import { NgModule } from '@angular/core';
import { SkyFilterBarModule } from '@skyux/filter-bar';

import { FilterBarRoutingModule } from './filter-bar-routing.module';
import { FilterBarComponent } from './filter-bar.component';

@NgModule({
  declarations: [FilterBarComponent],
  imports: [FilterBarRoutingModule, SkyFilterBarModule],
})
export class FilterBarModule {
  public static routes = FilterBarRoutingModule.routes;
}
