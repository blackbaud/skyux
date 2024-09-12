import { NgModule } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule, SkySortModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';

import { ToolbarStandardItemsRoutingModule } from './toolbar-standard-items-routing.module';
import { ToolbarStandardItemsComponent } from './toolbar-standard-items.component';

@NgModule({
  declarations: [ToolbarStandardItemsComponent],
  imports: [
    SkyFilterModule,
    SkyToolbarModule,
    SkySearchModule,
    SkySortModule,
    ToolbarStandardItemsRoutingModule,
  ],
})
export class ToolbarStandardItemsModule {
  public static routes = ToolbarStandardItemsRoutingModule.routes;
}
